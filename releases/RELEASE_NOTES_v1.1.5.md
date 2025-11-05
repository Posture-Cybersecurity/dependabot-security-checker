# 🐛 Dependabot Security Checker v1.1.5

## 🚨 Critical Bug Fix

This release fixes a critical pagination issue that was preventing the action from working with GitHub's Dependabot alerts API.

## 🐛 Bug Fixes

### **Pagination Error - CRITICAL FIX**
- **Fixed**: Replaced unsupported `page` parameter with proper Link header pagination
- **Issue**: The action was failing with error: "Pagination using the `page` parameter is not supported"
- **Solution**: Now uses `octokit.paginate()` which automatically handles GitHub's Link header pagination
- **Impact**: The action now works correctly with all repositories, regardless of alert count

### **What Changed**
- Removed manual page-based pagination loop
- Implemented `octokit.paginate()` for automatic Link header handling
- Simplified code and improved reliability
- Better error messages including API documentation URLs

## 🔧 Technical Details

**Before (v1.1.2):**
```javascript
const response = await octokit.rest.dependabot.listAlertsForRepo({
  owner,
  repo,
  per_page: 100,
  page: page  // ❌ Not supported by GitHub API
});
```

**After (v1.1.5):**
```javascript
const allAlerts = await octokit.paginate(
  octokit.rest.dependabot.listAlertsForRepo,
  {
    owner,
    repo,
    per_page: 100
  }
);  // ✅ Automatically handles Link headers
```

## 📋 Migration Guide

### **No Breaking Changes**
- Fully backward compatible
- No configuration changes required
- Simply update your workflow to use `@v1.1.5`

### **Update Your Workflows**
```yaml
- name: Check Dependabot Alerts
  uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.5
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
    severities: 'critical,high'
    output-file: 'security-report.csv'
    fail-on-alerts: 'true'
```

## ✅ What's Fixed

- ✅ Action now successfully fetches all Dependabot alerts
- ✅ Works with repositories of any size
- ✅ Proper error handling with helpful messages
- ✅ No more "page parameter not supported" errors

## 🚀 Quick Start

If you were experiencing pagination errors, simply update to v1.1.5:

```yaml
uses: Posture-Cybersecurity/dependabot-security-checker@v1.1.5
```

## 📊 Testing

- ✅ Tested with repositories containing 100+ alerts
- ✅ Verified Link header pagination works correctly
- ✅ Confirmed backward compatibility

## 🎯 Impact

**High Priority Fix** - This release resolves a critical issue that prevented the action from functioning at all. Users should upgrade immediately if they were experiencing pagination errors.

---

**Made with ❤️ by Posture Cybersecurity**

*Keeping your dependencies secure, one alert at a time.*

## 📋 Changelog

### v1.1.5 (2024-10-08)
- 🐛 **CRITICAL**: Fixed pagination error preventing action from working
- 🐛 Fixed: Replaced unsupported `page` parameter with Link header pagination
- 🔧 Improved: Simplified pagination logic using `octokit.paginate()`
- 📚 Updated: Better error messages with API documentation links

### v1.1.4
- (Previous version with pagination bug)

### v1.1.3
- (Previous version with pagination bug)

### v1.1.2
- (Previous version with pagination bug)

### v1.1.0
- ✨ Added pagination support (but had incorrect implementation)
- ✨ Enhanced summary statistics and analytics
- ✨ Improved error handling and logging

