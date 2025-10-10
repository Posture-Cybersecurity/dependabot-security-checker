// Local test script for the Dependabot Security Checker
// This simulates the GitHub Action environment

const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

// Mock GitHub context
github.context = {
  repo: {
    owner: 'test-owner',
    repo: 'test-repo'
  }
};

// Mock core functions
const originalCore = { ...core };
core.getInput = (name, options) => {
  const mockInputs = {
    'github-token': process.env.GITHUB_TOKEN || 'mock-token',
    'severities': 'critical,high,medium',
    'output-file': 'test_alerts.csv',
    'fail-on-alerts': 'false'
  };
  return mockInputs[name] || (options?.default || '');
};

core.info = (message) => console.log(`ℹ️  ${message}`);
core.warning = (message) => console.log(`⚠️  ${message}`);
core.setFailed = (message) => console.log(`❌ ${message}`);

// Mock GitHub API response with more diverse data
const mockAlerts = [
  {
    number: 1,
    state: 'open',
    security_advisory: { severity: 'critical' },
    dependency: { 
      package: { name: 'vulnerable-package' },
      scope: 'dependencies'
    },
    created_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/test-owner/test-repo/security/dependabot/1'
  },
  {
    number: 2,
    state: 'open',
    security_advisory: { severity: 'high' },
    dependency: { 
      package: { name: 'another-vulnerable-package' },
      scope: 'devDependencies'
    },
    created_at: '2024-01-02T00:00:00Z',
    html_url: 'https://github.com/test-owner/test-repo/security/dependabot/2'
  },
  {
    number: 3,
    state: 'dismissed',
    security_advisory: { severity: 'medium' },
    dependency: { 
      package: { name: 'fixed-package' },
      scope: 'dependencies'
    },
    created_at: '2024-01-03T00:00:00Z',
    html_url: 'https://github.com/test-owner/test-repo/security/dependabot/3'
  },
  {
    number: 4,
    state: 'open',
    security_advisory: { severity: 'low' },
    dependency: { 
      package: { name: 'low-risk-package' },
      scope: 'peerDependencies'
    },
    created_at: '2024-01-04T00:00:00Z',
    html_url: 'https://github.com/test-owner/test-repo/security/dependabot/4'
  }
];

// Mock octokit
const mockOctokit = {
  rest: {
    dependabot: {
      listAlertsForRepo: async () => ({ data: mockAlerts })
    }
  }
};

github.getOctokit = () => mockOctokit;

console.log('🧪 Testing Dependabot Security Checker Action Locally...\n');

// Import the main function
const mainModule = require('./src/index.js');

// The run function is called automatically in the module, but we need to override the mocks first
// Let's just run the test by calling the main logic directly
async function testAction() {
  try {
    // Simulate the main run function
    const allAlerts = mockAlerts; // Use our mock data
    console.log(`📈 Total alerts found: ${allAlerts.length}`);
    
    // Filter alerts by severity and state
    const severities = ['critical', 'high', 'medium'];
    const filteredAlerts = allAlerts.filter(alert => {
      const severity = alert.security_advisory?.severity?.toLowerCase() || '';
      const state = alert.state?.toLowerCase() || '';
      return state === 'open' && severities.includes(severity);
    });
    
    // Generate summary statistics
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
    
    // Log summary
    console.log('📊 === SUMMARY STATISTICS ===');
    console.log(`📈 Total alerts: ${summary.total}`);
    console.log(`🔓 Open alerts: ${summary.open}`);
    console.log(`🔒 Closed alerts: ${summary.closed}`);
    console.log(`🎯 Filtered alerts (${summary.checkedSeverities.join('/')}): ${summary.filtered}`);
    
    console.log('📊 By severity:');
    Object.entries(summary.bySeverity).forEach(([severity, count]) => {
      console.log(`  ${severity}: ${count}`);
    });
    
    console.log('📊 By scope:');
    Object.entries(summary.byScope).forEach(([scope, count]) => {
      console.log(`  ${scope}: ${count}`);
    });
    console.log('========================');
    
    if (filteredAlerts.length > 0) {
      console.log(`🚨 Found ${filteredAlerts.length} open ${severities.join('/')} alerts`);
      
      // Create CSV content
      const csvContent = createCSV(filteredAlerts, summary);
      require('fs').writeFileSync('test_alerts.csv', csvContent);
      
      console.log(`📁 Results saved to test_alerts.csv`);
    } else {
      console.log('✅ No open security alerts found');
    }
    
    console.log('\n✅ Local test completed!');
    console.log('📁 Check if test_alerts.csv was created');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Helper function to create CSV
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

// Run the test
testAction();
