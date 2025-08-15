# Spec Mode Guidelines

## 1. Purpose

Spec Mode is a specification-driven development workflow that transforms the traditional requirement-to-implementation process into a more structured and traceable approach:

**Traditional Flow**: Requirement → Direct Implementation
**Spec Mode Flow**: Requirement → Context Collection & Detailed Planning → Persistent Planning Documentation → Implementation

### Key Benefits:
- **Interruptible**: Planning is saved in actual files, allowing interruption and resumption at any point
- **Traceable**: Complete planning records for audit and review
- **Higher Quality**: Comprehensive upfront planning reduces implementation errors
- **Collaborative**: Planning documents can be shared and reviewed by team members

## 2. Spec Mode Execution Flow

### Phase 1: Collect Original Requirements
- Gather complete requirement specifications from user
- Identify all stakeholders and constraints
- Document assumptions and dependencies
- Clarify ambiguous requirements through questioning

### Phase 2: Detailed Planning & Design
- Analyze existing codebase context
- Design comprehensive implementation approach
- Break down work into discrete, trackable tasks
- Define acceptance criteria and validation steps
- Document all planning in persistent files

### Phase 3: Strict Implementation Execution
- Follow the designed plan exactly
- Update progress tracking in real-time
- Only deviate from plan through formal modification process
- Validate each step against acceptance criteria

## 3. Planning File Location and Format

### File Structure
All spec mode planning files are stored in the `.spec/` directory at project root:

```
.spec/
├── SPEC-{YYYY-MM-DD}-{short-description}.md
├── SPEC-{YYYY-MM-DD}-{short-description}.md
└── ...
```

### Unified Spec File Format
Each specification file contains all three components in a single document:

```markdown
# Spec: {Title}

**Created**: {YYYY-MM-DD HH:MM:SS}
**Last Updated**: {YYYY-MM-DD HH:MM:SS}
**Status**: [Draft/Planning/In Progress/Completed]

---

## Part 1: Requirements

### Original Request
{Verbatim user request}

### Clarified Requirements
{Detailed, unambiguous requirements}

### Assumptions
{List of assumptions made}

### Dependencies
{External dependencies and constraints}

### Success Criteria
{Clear acceptance criteria}

---

## Part 2: Design & Planning

### Context Analysis
{Current codebase analysis}

### Design Approach
{High-level design decisions}

### Implementation Plan
{Detailed step-by-step implementation}

### Risk Assessment
{Potential risks and mitigation strategies}

### Validation Plan
{How to verify implementation success}

---

## Part 3: Progress Tracking

### Implementation Status
- [ ] Step 1: {Description}
- [ ] Step 2: {Description}
- [x] Step 3: {Description} ✅ Completed {timestamp}

### Current Phase
{Current implementation phase}

### Completed Work
{Summary of completed tasks}

### Next Steps
{Immediate next actions}

### Issues & Blockers
{Current challenges and resolutions}

### Change Log
{Record of all modifications to this spec}
```

## 4. Planning File Modification Rules

### Core Principle: Immutability of Completed Work
Once progress tracking shows a task as completed, the original requirements and design for that task become **immutable**.

### Modification Process

#### For Uncompleted Tasks:
- Direct modification of requirements and design files is allowed
- Update timestamps and change logs
- Notify all stakeholders of changes

#### For Completed Tasks:
**PROHIBITED**: Modifying original requirements or design for completed work

**REQUIRED**: Create new entries as additive specifications:
1. Create new requirement file with prefix `ADDENDUM-{original-spec-id}-{sequence}`
2. Reference original specification
3. Clearly mark as additive/modification request
4. Create corresponding new design and progress files
5. Link all files in a modification chain

#### Example Modification Chain:
```
Original: SPEC-2024-01-15-user-auth.md (completed)
Addition: ADDENDUM-SPEC-2024-01-15-user-auth-001-oauth.md
```

### Change Tracking
- All modifications must include rationale
- Maintain change history in each file
- Cross-reference related files
- Update master specification index when files are created

### Validation Rules
Before any file modification:
1. Check progress tracking status
2. Verify modification permissions based on completion status
3. Follow appropriate modification pathway
4. Update all related documentation
5. Validate file format compliance
