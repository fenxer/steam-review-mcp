# In Progress Workflow

## When to Use This Workflow

- Spec status is "In Progress"
- Implementation has begun following the Implementation Plan
- Active development is happening
- Progress tracking and plan adjustments are needed

## Workflow Steps

### Phase 1: Execution Management
- Follow Implementation Plan tasks in sequence
- Update Progress Tracking in real-time
- Mark tasks as in-progress → completed with timestamps
- Reference actual code changes and commits

### Phase 2: Dynamic Plan Adjustments
- Document any deviations from original plan in Change Log
- Follow formal modification process for plan changes
- Maintain immutability of completed work
- Ensure all adjustments are authorized and documented

### Phase 3: Progress Validation
- Validate each completed step against acceptance criteria
- Update Completed Work section with details and links
- Track and resolve any blockers or issues
- Maintain clear audit trail of all changes

## Active Sections During Execution

### Implementation Status (Critical)
**Purpose**: Track progress of each implementation step with precise status updates

**Requirements**:
- Use task identifiers from Implementation Plan (e.g., [P1-T1])
- Include completion timestamps for finished tasks
- Reference specific file changes or commits
- Mark blocked tasks with blocker information
- Update status in real-time as work progresses

**Format**:
```
Phase 1: Core Infrastructure
- [x] [P1-T1]: Create src/types/steam-review.ts ✅ Completed 2024-01-15 14:30
- [x] [P1-T2]: Create src/utils/steam-api.ts ✅ Completed 2024-01-15 15:45
- [ ] [P1-T3]: Create src/tools/steam-review-tool.ts (In Progress - 60% complete)
```

### Change Log (Critical - Now Active)
**Purpose**: Document Implementation Plan adjustments during execution

**Activation**: Only becomes active when status changes to "In Progress"

**Modification Process Requirements**:
- When modifying an executing Implementation Plan, **MUST** provide:
  - **Reason**: Clear justification for why the change is necessary
  - **Authorized by**: Who approved/authorized this modification
- After plan adjustment, **MUST** synchronize and document:
  - **Change**: Specific modifications made to the original plan
  - **Impact**: Effects on timeline, dependencies, and previously completed tasks

**Format**:
```
2024-01-15 16:00 - Split P2-T1 into separate tasks
- Reason: Discovered existing MCP tool registration conflicts with new implementation
- Authorized by: Development lead after architecture review
- Change: P2-T1 → P2-T1a (refactor existing pattern) + P2-T1b (implement new tool)
- Impact: +1 hour to Phase 2, no impact on completed P1 tasks
```

### Completed Work
**Purpose**: Maintain chronological record of finished tasks

**Requirements**:
- Link to actual commits/PRs
- Note any deviations from original plan
- Record lessons learned or important decisions

### Issues & Blockers
**Purpose**: Track obstacles and their resolution

**Requirements**:
- Document severity levels
- Include resolution steps and timelines
- Note escalation paths
- Track to resolution

## ⚠️ CRITICAL: Modification Rules During Execution

**STRICT COMPLIANCE REQUIRED**: All modifications MUST follow the formal process defined in .context/spec/modification-rules.md

### Core Principle: Immutability of Completed Work
Once a task is marked as completed, its original requirements and design become **immutable**.

### For Uncompleted Tasks
- ✅ **Allowed**: Direct modification of Implementation Plan
- ⚠️ **MANDATORY**: Follow "In Progress Status → For Uncompleted Tasks" process in .context/spec/modification-rules.md
- ⚠️ **REQUIRED**: Document ALL changes in Change Log with:
  - **Reason** (before modification)
  - **Authorized by** (before modification)
  - **Change** (after modification)
  - **Impact** (after modification)

### For Completed Tasks
- ❌ **STRICTLY PROHIBITED**: Modifying original requirements or design
- ⚠️ **MANDATORY**: Use ADDENDUM system - follow "ADDENDUM System" in .context/spec/modification-rules.md
- ⚠️ **REQUIRED**: Create new specification file with proper ADDENDUM naming convention

### Change Log Process - MANDATORY COMPLIANCE
**CRITICAL**: Every plan modification MUST include:

1. **Pre-Modification Requirements** (MUST provide before making any changes):
   - **Reason**: Clear justification for why change is necessary
   - **Authorized by**: Who approved/authorized this modification

2. **Post-Modification Requirements** (MUST document after changes):
   - **Change**: Specific modifications made to original plan
   - **Impact**: Effects on timeline, dependencies, completed tasks

3. **Format Compliance**: MUST use exact template from .context/spec/modification-rules.md

**⚠️ VIOLATION CONSEQUENCES**: Modifications without proper documentation will be rejected and must be corrected.

**📖 MANDATORY REFERENCE**: .context/spec/modification-rules.md

## Transition to Completion

When all implementation tasks are complete:
1. Validate all success criteria are met
2. Complete final testing and validation
3. Update status to "Completed"
4. Follow .context/spec/completed-workflow.md
