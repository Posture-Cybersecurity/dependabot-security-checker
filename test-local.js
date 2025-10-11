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

// Import and run the main function
const { run } = require('./src/index.js');

// Override the run function to use our mocks
const originalRun = run;
run().then(() => {
  console.log('\n✅ Local test completed!');
  console.log('📁 Check if test_alerts.csv was created');
}).catch(error => {
  console.error('❌ Test failed:', error.message);
});
