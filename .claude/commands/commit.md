---
description: Create a git commit
argument-hint: [issues]
---

## Critical Workflow

⚠️ **MANDATORY**: Always read `.context/COMMIT.md` FIRST before creating any commit message.

### Required Steps (In Order)
1. **Read Project Standards**: Load and understand `.context/COMMIT.md` requirements
2. **Analyze Changes**: Review git status and diff output
3. **Apply Standards**: Create commit message following exact project format
4. **Verify Compliance**: Ensure message matches project template exactly

## Context

- Current git status: !`git status`
- Current git diff (staged and unstaged changes): !`git diff HEAD`
- Current branch: !`git branch --show-current`

## Argument Handling
- If `[issues]` argument is provided, it can be a single issue number or comma-separated issue numbers
- If issues are provided, pass them as the `tickets` parameter to `.context/COMMIT.md`

## Your task

1. **FIRST**: Read `.context/COMMIT.md` to understand project-specific commit format requirements
2. **THEN**: Based on all changes, strictly follow the commit style guidelines in `.context/COMMIT.md` to generate a single commit message

## Common Mistakes to Avoid
- ❌ Using general commit knowledge instead of project standards
- ❌ Adding extra content not specified in project format
- ❌ Skipping the step of reading project commit guidelines
- ❌ Using wrong type/scope based on file paths
