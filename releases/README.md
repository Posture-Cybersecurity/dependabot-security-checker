# 📦 Release Notes

This directory contains detailed release notes for all versions of the Dependabot Security Checker.

## 🚀 Available Releases

### [v1.1.0](./RELEASE_NOTES_v1.1.0.md) - Enhanced Security Monitoring
**Latest Release** - Major feature update with pagination support, enhanced analytics, and improved error handling.

**Key Features:**
- 🔄 Pagination support for large repositories (100+ alerts)
- 📊 Enhanced summary statistics and analytics
- 🛡️ Improved error handling with detailed messages
- 🔑 DEPENDABOT_TOKEN support for better reliability
- 📈 Rich console logging with progress indicators

### [v1.0.0](./RELEASE_NOTES_v1.0.0.md) - Initial Release
**Foundation Release** - Basic Dependabot alert checking with CSV export capabilities.

**Key Features:**
- 🔍 Basic Dependabot alert checking
- 📊 CSV report generation
- ⚙️ Configurable severity levels
- 🛡️ Basic error handling

## 📋 Release History

| Version | Date | Type | Description |
|---------|------|------|-------------|
| [v1.1.0](./RELEASE_NOTES_v1.1.0.md) | 2024-01-XX | Major | Enhanced security monitoring with pagination and analytics |
| [v1.0.0](./RELEASE_NOTES_v1.0.0.md) | 2024-01-XX | Initial | Foundation release with basic functionality |

## 🔄 Migration Guide

### Upgrading from v1.0.0 to v1.1.0

**Breaking Changes:** None - fully backward compatible

**New Features:**
- Pagination support for large repositories
- Enhanced summary statistics
- Better error handling and logging
- DEPENDABOT_TOKEN support (recommended)

**Upgrade Steps:**
1. Update your workflow to use `@v1.1.0`
2. Add `DEPENDABOT_TOKEN` secret (optional but recommended)
3. Enjoy enhanced features and better reliability

## 📚 Documentation

- **Main README**: [../README.md](../README.md)
- **Usage Examples**: [../examples/](../examples/)
- **GitHub Action**: [../action.yml](../action.yml)

## 🎯 Quick Start

```yaml
- uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.0
  with:
    github-token: ${{ secrets.DEPENDABOT_TOKEN }}
    severities: 'critical,high'
    output-file: 'security-report.csv'
    fail-on-alerts: 'true'
```

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Posture-Cybersecurity/dependabot-security-checker/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/Posture-Cybersecurity/dependabot-security-checker/discussions)
- 📖 **Documentation**: [Main README](../README.md)

---

**Made with ❤️ by Posture Cybersecurity**

