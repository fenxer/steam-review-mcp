---
description: Create a git commit
argument-hint: [issues]
---

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`

## Argument Handling
- If `[issues]` argument is provided, it can be a single issue number or comma-separated issue numbers
- Include each issue in the commit message as separate `close: #[issue]` lines
- If no issues argument is provided, omit the issue references entirely

## Format

For single issue:
```
<type>(<scope>): <description>

close: #[issue]

Co-Authored-By: Claude <noreply@anthropic.com>
```

For multiple issues:
```
<type>(<scope>): <description>

close: #[issue1]
close: #[issue2]
close: #[issue3]

Co-Authored-By: Claude <noreply@anthropic.com>
```

Where:
- `<type>`: Required commit type
- `<scope>`: Optional scope (recommended)
- `<description>`: Required short description
- `close: #[issue]`: One line per issue (only if issues argument provided)

For commit style guidelines including types, scopes, examples and rules, see `.context/COMMIT.md`.

## Your task

Based on the all changes, strictly follow the commit style guidelines in `.context/COMMIT.md` to generate a single commit message.
