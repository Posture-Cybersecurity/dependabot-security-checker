# Dependabot Security Checker

A powerful GitHub Action that checks for open Dependabot security alerts with comprehensive reporting, flexible configuration, and enterprise-ready features.

## ✨ Features

- 🔍 **Multi-severity monitoring**: Check for critical, high, medium, and low severity alerts
- 📊 **Rich CSV reports**: Export alerts with full metadata and summary statistics
- 🔄 **Pagination support**: Handles repositories with 100+ alerts efficiently
- 🛡️ **CI/CD integration**: Perfect for security gates and deployment checks
- ⚙️ **Flexible configuration**: Customize behavior for your workflow
- 📈 **Summary analytics**: Get insights into your security posture

## Usage

### Basic Usage

```yaml
name: Security Check
on: [push, pull_request]

jobs:
  security-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Dependabot Alerts
        uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.0
        with:
          github-token: ${{ secrets.DEPENDABOT_TOKEN }}
```

### Advanced Usage

```yaml
- name: Check Dependabot Alerts
  uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.0
  with:
    github-token: ${{ secrets.DEPENDABOT_TOKEN }}
    severities: 'critical,high'  # Only check critical and high
    output-file: 'security-report.csv'
    fail-on-alerts: 'true'  # Fail workflow if alerts found
```

## Permissions Required

The action requires access to Dependabot alerts. You have two options:

### Option 1: Personal Access Token (Recommended)

1. **Create a Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` and `security_events` scopes
   - Add it as a repository secret named `DEPENDABOT_TOKEN`

2. **Use in your workflow**:
   ```yaml
   - uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.0
     with:
       github-token: ${{ secrets.DEPENDABOT_TOKEN }}
   ```

### Option 2: Workflow Permissions

Add permissions to your workflow:
```yaml
permissions:
  security-events: read  # Required to read Dependabot alerts
  contents: read        # Required to read repository contents
```

**Note**: The default `GITHUB_TOKEN` may not have sufficient permissions. Using a Personal Access Token is more reliable.

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

## 🎯 Use Cases

### Security Gates
- Block deployments with critical vulnerabilities
- Enforce security policies in CI/CD pipelines
- Monitor security posture across teams

### Compliance & Auditing
- Generate security reports for compliance
- Track vulnerability trends over time
- Maintain audit trails

### Team Collaboration
- Share security status with stakeholders
- Integrate with project management tools
- Automate security notifications

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