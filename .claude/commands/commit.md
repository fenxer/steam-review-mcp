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
- If issues are provided, pass them as the `tickets` parameter to `@.context/COMMIT.md`.

## Your task

Based on the all changes, strictly follow the commit style guidelines in `@.context/COMMIT.md` to generate a single commit message.
