# 📋 Changelog

All notable changes to the Dependabot Security Checker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-01-XX

### Added
- 🔄 **Pagination support** for repositories with 100+ Dependabot alerts
- 📊 **Enhanced summary statistics** with breakdown by severity and scope
- 🛡️ **Improved error handling** with specific HTTP status code messages
- 🔑 **DEPENDABOT_TOKEN support** for better reliability than GITHUB_TOKEN
- 📈 **Rich console logging** with emojis and progress indicators
- 🧪 **Comprehensive testing workflows** for validation
- 📚 **Enhanced documentation** with permissions and troubleshooting guides

### Changed
- **CSV creation logic** - now creates files even when no alerts are found
- **Error messages** - more detailed and actionable error reporting
- **Documentation** - updated all examples to use DEPENDABOT_TOKEN
- **Version references** - updated to v1.1.0 throughout

### Fixed
- **CSV file creation** - fixed issue where files weren't created with 0 alerts
- **Permission handling** - added comprehensive permission documentation
- **Artifact upload** - fixed file path mismatches in workflows
- **Token usage** - standardized on DEPENDABOT_TOKEN for reliability

### Security
- **Enhanced token handling** with proper permission scopes
- **Secure error reporting** without exposing sensitive information
- **Privacy-focused design** with no external API calls beyond GitHub

## [1.0.0] - 2024-01-XX

### Added
- 🎉 **Initial release** of Dependabot Security Checker
- 🔍 **Basic Dependabot alert checking** by severity level
- 📊 **CSV report generation** with alert metadata
- ⚙️ **Configurable severity levels** (critical, high, medium, low)
- 🛡️ **Basic error handling** and logging
- 📚 **Initial documentation** and examples

### Features
- Multi-severity security monitoring
- CSV export with detailed alert information
- Configurable failure behavior
- GitHub Actions integration
- Basic error handling and logging

---

## 🔄 Version History

| Version | Release Date | Type | Key Features |
|---------|--------------|------|--------------|
| [1.1.0] | 2024-01-XX | Major | Pagination, Analytics, Enhanced Error Handling |
| [1.0.0] | 2024-01-XX | Initial | Basic Alert Checking, CSV Export |

## 📝 Version Types

- **Major** (X.0.0): Breaking changes or major new features
- **Minor** (X.Y.0): New features, backward compatible
- **Patch** (X.Y.Z): Bug fixes, backward compatible

## 🎯 Future Roadmap

### Planned Features
- 🔔 **Slack/Teams notifications** for security alerts
- 📊 **Advanced analytics dashboards** with trend analysis
- 🔗 **JIRA integration** for ticket creation
- 📈 **Trend analysis and reporting** over time
- 🎨 **Custom report formats** (JSON, XML, etc.)
- 🌐 **Multi-repository scanning** for organization-wide monitoring

### Under Consideration
- **Database integration** for historical tracking
- **Custom webhook support** for external integrations
- **Advanced filtering** with custom criteria
- **Scheduled reporting** with email delivery
- **API endpoints** for programmatic access

---

**For detailed release notes, see the [releases/](./releases/) directory.**
