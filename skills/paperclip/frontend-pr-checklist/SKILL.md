---
name: frontend-pr-checklist
description: >
  Use this skill before marking a frontend task as done. Runs through a
  pre-merge checklist covering tests, accessibility, responsiveness, and
  code quality.
---

## Frontend PR Checklist

Work through each item before marking the issue complete:

### Tests
- [ ] All existing tests pass: `pnpm test:run`
- [ ] New component has at least one test covering its primary behaviour
- [ ] No test is skipped with `.skip` without a comment explaining why

### Accessibility
- [ ] All interactive elements are keyboard-focusable
- [ ] All images have descriptive `alt` text (or `alt=""` if decorative)
- [ ] Form inputs have associated `<label>` elements
- [ ] No colour is the only indicator of state (use icon or text too)

### Responsiveness
- [ ] Component renders correctly at 375px (mobile) and 1280px (desktop) widths
- [ ] No horizontal scroll introduced at any breakpoint

### Code Quality
- [ ] No unused imports
- [ ] No `console.log` left in production code
- [ ] No hardcoded colours outside the Tailwind design token system
- [ ] TypeScript: no `any` types introduced without a comment explaining why

Post the completed checklist as a comment on the issue before closing it.
