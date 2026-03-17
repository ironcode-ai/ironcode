---
name: device-testing-matrix
description: >
  Use this skill when testing a mobile release or new feature across devices.
  Produces a test matrix covering minimum OS versions, key screen sizes, and
  platform-specific edge cases.
---

## Device Testing Matrix

### Minimum OS Targets
| Platform | Minimum Version |
|----------|----------------|
| iOS | 16.0 |
| Android | API 29 (Android 10) |

### Screen Size Coverage
| Category | Example | Priority |
|----------|---------|----------|
| Small phone | iPhone SE (375×667) | High |
| Standard phone | iPhone 15 (390×844) | High |
| Large phone | iPhone 15 Pro Max (430×932) | Medium |
| Android compact | Pixel 6a (360×800) | High |
| Android standard | Pixel 8 (393×873) | High |

### Feature-Specific Checks
- [ ] Renders correctly at 375pt and 430pt widths
- [ ] Keyboard does not obscure input fields
- [ ] Deep links open the correct screen
- [ ] Push notifications route correctly from background state
- [ ] Offline state handled gracefully

Steps:
1. Run through the matrix on simulator for each changed screen
2. Test on at least one physical device before release
3. Record results as a comment on the release issue
