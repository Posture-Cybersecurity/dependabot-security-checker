# Dependabot Security Checker

A GitHub Action that checks for open Dependabot security alerts and optionally fails the workflow if alerts are found.

## Features

- 🔍 Checks for open Dependabot alerts by severity level
- 📊 Exports results to CSV format
- ⚙️ Configurable severity levels and failure behavior
- 🛡️ Integrates with GitHub's security features

## Usage

### Basic Usage

```yaml
name: Security Check
on: [push, pull_request]

jobs:
  security-check:
    runs-on: ubuntu-latest
    permissions:
      security-events: read
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Check Dependabot Alerts
        uses: Posture-Cybersecurity/dependabot-security-checker@v1.0.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

### Advanced Usage

```yaml
- name: Check Dependabot Alerts
  uses: Posture-Cybersecurity/dependabot-security-checker@v1.0.0
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    severities: 'critical,high'  # Only check critical and high
    output-file: 'security-report.csv'
    fail-on-alerts: 'true'  # Fail workflow if alerts found
```

## Permissions Required

The action requires the following permissions to access Dependabot alerts:

```yaml
permissions:
  security-events: read  # Required to read Dependabot alerts
  contents: read        # Required to read repository contents
```

**Note**: The default `GITHUB_TOKEN` may not have sufficient permissions. You may need to:
1. Add the permissions block to your workflow (recommended)
2. Use a Personal Access Token with `security_events` scope
3. Use a GitHub App with appropriate permissions

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `github-token` | GitHub token with `security-events:read` permission | ✅ | - |
| `severities` | Comma-separated list of severities to check | ❌ | `critical,high,medium` |
| `output-file` | Output CSV file name | ❌ | `dependabot_alerts.csv` |
| `fail-on-alerts` | Fail the workflow if alerts are found | ❌ | `true` |

## Outputs

The action creates a CSV file with the following columns:
- `number`: Alert number
- `package`: Package name
- `severity`: Alert severity
- `state`: Alert state
- `dependency_scope`: Dependency scope
- `created_at`: Alert creation date
- `url`: Alert URL

## Testing

### Local Testing

```bash
# Install dependencies
npm install

# Build the action
npm run build

# Run local test
node test-local.js
```

### GitHub Testing

1. Push your action to a GitHub repository
2. Create a test workflow using the action
3. Check the workflow runs and produces expected results

## Development

```bash
# Install dependencies
npm install

# Build the action
npm run build

# Run tests
npm test
```

## License

MIT