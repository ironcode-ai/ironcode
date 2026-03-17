---
name: mobile-release-checklist
description: >
  Use this skill when preparing a mobile app release. Runs through the
  pre-release checklist, triggers the EAS build, and posts a release summary
  comment on the milestone tracking issue.
---

## Mobile Release Checklist

### Version
- [ ] Bump `version` in `app.json` / `app.config.ts`
- [ ] Bump `versionCode` (Android) and `buildNumber` (iOS)
- [ ] Update `CHANGELOG.md` with release notes

### Code Quality
- [ ] All CI checks green on release branch
- [ ] No `console.log` or debug flags in production code
- [ ] Feature flags for incomplete features are disabled

### Build
- [ ] Run `eas build --platform all --profile production`
- [ ] Confirm build completes without errors in EAS dashboard
- [ ] Smoke-test build on a physical device (iOS + Android)

### Store Submission
- [ ] Upload to TestFlight (iOS)
- [ ] Upload to Play Console internal track (Android)
- [ ] Update store screenshots if UI changed significantly

### Post-release
- [ ] Post release summary comment on milestone issue
- [ ] Close the milestone
- [ ] Create next milestone
