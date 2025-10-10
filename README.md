# Dependabot Security Checker

A GitHub Action that checks for open Dependabot alerts and fails the workflow if critical/high/medium severity alerts are found.

## Usage

```yaml
- name: Check Dependabot Alerts
  uses: Posture-Cybersecurity/dependabot-security-checker@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    severities: 'critical,high,medium'
    output-file: 'security_alerts.csv'
    fail-on-alerts: 'true'
```

## Inputs

- `github-token`: GitHub token with security-events:read permission (required)
- `severities`: Comma-separated list of severities to check (default: critical,high,medium)
- `output-file`: Output CSV file name (default: dependabot_alerts.csv)
- `fail-on-alerts`: Fail the workflow if alerts are found (default: true)

## Outputs

- Creates a CSV file with alert details
- Fails the workflow if alerts are found (configurable)
