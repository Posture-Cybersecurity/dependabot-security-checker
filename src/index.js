const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const severitiesInput = core.getInput('severities') || 'critical,high,medium';
    const outputFile = core.getInput('output-file') || 'dependabot_alerts.csv';
    const failOnAlerts = core.getInput('fail-on-alerts') === 'true';
    
    const severities = severitiesInput.split(',').map(s => s.trim().toLowerCase());
    const octokit = github.getOctokit(token);
    
    const { owner, repo } = github.context.repo;
    
    core.info(`🔍 Checking Dependabot alerts for ${owner}/${repo}`);
    core.info(`📊 Severities to check: ${severities.join(', ')}`);
    core.info(`⚙️  Output file: ${outputFile}`);
    core.info(`🚨 Fail on alerts: ${failOnAlerts}`);
    
    // Fetch all Dependabot alerts with pagination
    const allAlerts = await fetchAllAlerts(octokit, owner, repo);
    core.info(`📈 Total alerts found: ${allAlerts.length}`);
    
    // Filter alerts by severity and state
    const filteredAlerts = allAlerts.filter(alert => {
      const severity = alert.security_advisory?.severity?.toLowerCase() || '';
      const state = alert.state?.toLowerCase() || '';
      return state === 'open' && severities.includes(severity);
    });
    
    // Generate summary statistics
    const summary = generateSummary(allAlerts, filteredAlerts, severities);
    logSummary(summary);
      
    // Always create CSV file with results
    const csvContent = createCSV(filteredAlerts, summary);
      fs.writeFileSync(outputFile, csvContent);
    core.info(`📁 Results saved to ${outputFile}`);
      
    if (filteredAlerts.length > 0) {
      core.warning(`🚨 Found ${filteredAlerts.length} open ${severities.join('/')} alerts`);
      
      if (failOnAlerts) {
        core.setFailed(`❌ Found ${filteredAlerts.length} open security alerts`);
      }
    } else {
      core.info('✅ No open security alerts found');
    }
    
  } catch (error) {
    core.error(`❌ Action failed: ${error.message}`);
    core.error(`📋 Error details: ${error.stack || 'No stack trace available'}`);
    core.setFailed(`Action failed: ${error.message}`);
  }
}

async function fetchAllAlerts(octokit, owner, repo) {
  try {
    core.info(`📄 Fetching Dependabot alerts (using Link header pagination)...`);
    
    // Use octokit.paginate which automatically handles Link header pagination
    // The Dependabot alerts API doesn't support the 'page' parameter
    const allAlerts = await octokit.paginate(octokit.rest.dependabot.listAlertsForRepo, {
      owner,
      repo,
      per_page: 100
    });
    
    core.info(`✅ Fetched ${allAlerts.length} total alerts`);
    return allAlerts;
    
  } catch (error) {
    if (error.status === 404) {
      core.warning('⚠️  Dependabot alerts not available for this repository');
      return [];
    } else if (error.status === 403) {
      throw new Error('❌ Insufficient permissions. Ensure your token has "security-events:read" permission');
    } else if (error.status === 401) {
      throw new Error('❌ Authentication failed. Check your GitHub token');
    } else {
      throw new Error(`❌ Failed to fetch alerts: ${error.message} - ${error.documentation_url || ''}`);
    }
  }
}

function generateSummary(allAlerts, filteredAlerts, severities) {
  const summary = {
    total: allAlerts.length,
    open: allAlerts.filter(a => a.state?.toLowerCase() === 'open').length,
    closed: allAlerts.filter(a => a.state?.toLowerCase() === 'dismissed').length,
    bySeverity: {},
    byScope: {},
    filtered: filteredAlerts.length,
    checkedSeverities: severities
  };
  
  // Count by severity
  allAlerts.forEach(alert => {
    const severity = alert.security_advisory?.severity?.toLowerCase() || 'unknown';
    summary.bySeverity[severity] = (summary.bySeverity[severity] || 0) + 1;
  });
  
  // Count by scope
  allAlerts.forEach(alert => {
    const scope = alert.dependency?.scope || 'unknown';
    summary.byScope[scope] = (summary.byScope[scope] || 0) + 1;
  });
  
  return summary;
}

function logSummary(summary) {
  core.info('📊 === SUMMARY STATISTICS ===');
  core.info(`📈 Total alerts: ${summary.total}`);
  core.info(`🔓 Open alerts: ${summary.open}`);
  core.info(`🔒 Closed alerts: ${summary.closed}`);
  core.info(`🎯 Filtered alerts (${summary.checkedSeverities.join('/')}): ${summary.filtered}`);
  
  core.info('📊 By severity:');
  Object.entries(summary.bySeverity).forEach(([severity, count]) => {
    core.info(`  ${severity}: ${count}`);
  });
  
  core.info('📊 By scope:');
  Object.entries(summary.byScope).forEach(([scope, count]) => {
    core.info(`  ${scope}: ${count}`);
  });
  core.info('========================');
}

function createCSV(alerts, summary) {
  const headers = ['number', 'package', 'severity', 'state', 'dependency_scope', 'created_at', 'url'];
  const rows = alerts.map(alert => [
    alert.number,
    alert.dependency?.package?.name || '',
    alert.security_advisory?.severity || '',
    alert.state,
    alert.dependency?.scope || '',
    alert.created_at,
    alert.html_url
  ]);
  
  // Create CSV content
  let csvContent = [headers, ...rows].map(row => 
    row.map(field => `"${field}"`).join(',')
  ).join('\n');
  
  // Add summary section at the end
  if (summary) {
    csvContent += '\n\n# SUMMARY STATISTICS\n';
    csvContent += `"Metric","Value"\n`;
    csvContent += `"Total Alerts","${summary.total}"\n`;
    csvContent += `"Open Alerts","${summary.open}"\n`;
    csvContent += `"Closed Alerts","${summary.closed}"\n`;
    csvContent += `"Filtered Alerts","${summary.filtered}"\n`;
    csvContent += `"Checked Severities","${summary.checkedSeverities.join(', ')}"\n`;
    
    // Add severity breakdown
    Object.entries(summary.bySeverity).forEach(([severity, count]) => {
      csvContent += `"Severity: ${severity}","${count}"\n`;
    });
    
    // Add scope breakdown
    Object.entries(summary.byScope).forEach(([scope, count]) => {
      csvContent += `"Scope: ${scope}","${count}"\n`;
    });
  }
  
  return csvContent;
}

run();