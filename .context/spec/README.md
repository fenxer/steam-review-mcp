# Spec Mode Guidelines

## Purpose

Spec Mode is a specification-driven development workflow that follows a structured approach: Requirement → Context Collection & Detailed Planning → Persistent Planning Documentation → Implementation

### Key Benefits:
- **Interruptible**: Planning is saved in actual files, allowing interruption and resumption at any point
- **Traceable**: Complete planning records for audit and review
- **Higher Quality**: Comprehensive upfront planning reduces implementation errors
- **Collaborative**: Planning documents can be shared and reviewed by team members

## Spec Standards

### File Location
All spec mode planning files are stored in the `.spec/` directory at project root:

```
.spec/
├── SPEC-{YYYY-MM-DD}-{short-description}.md
├── SPEC-{YYYY-MM-DD}-{short-description}.md
└── ...
```

### File Format Structure
Each specification file contains three main parts:

```markdown
# Spec: {Title}

**Created**: {YYYY-MM-DD HH:MM}
**Last Updated**: {YYYY-MM-DD HH:MM}
**Status**: [Draft/Planning/In Progress/Completed]

---

## Part 1: Requirements
## Part 2: Design & Planning
## Part 3: Progress Tracking
```

## Spec Status Workflows

### Status: Draft/Planning
**Purpose**: Initial specification creation and planning phase
**Workflow**: Requirements gathering → Design planning → Implementation planning

**📖 Complete Guide**: @.context/spec/draft-planning-workflow.md

### Status: In Progress
**Purpose**: Active implementation following the specification
**Workflow**: Implementation execution → Progress tracking → Dynamic plan adjustments

**📖 Complete Guide**: @.context/spec/in-progress-workflow.md

### Status: Completed
**Purpose**: Post-completion documentation and archival
**Workflow**: Final validation → Documentation → Archive

**📖 Complete Guide**: @.context/spec/completed-workflow.md

## Status-Based Routing

Choose your workflow based on your current spec status:

| Current Status | Next Action | Guide |
|---|---|---|
| **No spec exists** | Create new specification | @.context/spec/draft-planning-workflow.md |
| **Draft/Planning** | Complete planning and begin implementation | @.context/spec/draft-planning-workflow.md |
| **In Progress** | Continue implementation and track progress | @.context/spec/in-progress-workflow.md |
| **Completed** | Archive and document lessons learned | @.context/spec/completed-workflow.md |

## Modification Rules

### Core Principle: Immutability of Completed Work
Once progress tracking shows a task as completed, the original requirements and design for that task become **immutable**.

**📖 Detailed Modification Rules**: @.context/spec/modification-rules.md

## File Format Standards

**📖 Detailed Format Requirements**: @.context/spec/format-standards.md

## ⚠️ SPEC STANDARDS REVIEW GATE

### Pending Review Check
Before using any spec workflows, check for pending standards reviews:

**🔍 Check Status**: Look for PENDING files in `.context/spec/review/`
- **If PENDING reviews exist**: Complete review process before proceeding
- **If no PENDING reviews**: Proceed with spec workflows

### Standards Modification Process
When modifying spec standards or workflows:

1. **Create Review File**: Generate `REVIEW-{YYYY-MM-DD-HH-MM}.md` in `.context/spec/review/`
2. **Document Changes**: Include reason, goals, specific file changes with line numbers
3. **Request Review**: Notify appropriate reviewer
4. **Block Usage**: No spec workflows until review approved and archived

**📖 Review Process Details**: @.context/spec/review-process.md

### Workflow Blocking
**CRITICAL**: When PENDING review files exist in `.context/spec/review/`, all spec mode workflows are blocked to ensure standards consistency.

### Archive Management
- **Active Reviews**: `.context/spec/review/REVIEW-{timestamp}.md`
- **Completed Reviews**: `.context/spec/review/archive/REVIEW-{timestamp}.md`
