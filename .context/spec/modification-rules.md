# Specification Modification Rules

## Core Principle: Immutability of Completed Work

Once progress tracking shows a task as completed, the original requirements and design for that task become **immutable**.

## Modification Process by Status

**WORKFLOW INTEGRATION**: These rules are integrated into status-specific workflows:
- **In Progress**: .context/spec/in-progress-workflow.md
- **Completed**: .context/spec/completed-workflow.md

### Draft/Planning Status
**Scope**: Full modification allowed

**Allowed Actions**:
- ✅ Direct modification of all sections
- ✅ Restructuring requirements and design
- ✅ Adding/removing implementation tasks
- ✅ Updating timestamps and change information

**Requirements**:
- Update "Last Updated" timestamp
- Maintain consistency across all sections
- Ensure task identifiers remain unique

**Change Log**: Not active during planning phase

### In Progress Status
**Scope**: Controlled modification with formal process

#### For Uncompleted Tasks
**Allowed Actions**:
- ✅ Direct modification of Implementation Plan
- ✅ Adjustment of task details and requirements
- ✅ Reordering or restructuring pending tasks

**Requirements**:
- **MUST** document changes in Change Log
- **MUST** provide reason for modification
- **MUST** include authorization information
- **MUST** analyze impact on timeline and dependencies

#### For Completed Tasks
**Prohibited Actions**:
- ❌ Modifying original task requirements
- ❌ Changing completed task descriptions
- ❌ Altering completed work documentation

**Required Process**:
- **MUST** use ADDENDUM system for modifications
- **MUST** reference original specification
- **MUST** create new specification files for additional work

### Completed Status
**Scope**: Read-only with ADDENDUM system only

**Prohibited Actions**:
- ❌ Any direct modifications to the specification
- ❌ Changing requirements, design, or progress tracking
- ❌ Updating existing sections or content

**Required Process for Changes**:
- **MUST** create ADDENDUM specification
- **MUST** reference original completed specification
- **MUST** follow complete specification process for new work

## Change Log Requirements (In Progress Only)

### Mandatory Information
When modifying an executing Implementation Plan:

**Before Modification**:
- **Reason**: Clear justification for why change is necessary
- **Authorized by**: Who approved/authorized the modification

**After Modification**:
- **Change**: Specific modifications made to original plan
- **Impact**: Effects on timeline, dependencies, completed tasks

### Format Template
```markdown
YYYY-MM-DD HH:MM - {Brief description of change}
- Reason: {Detailed explanation of why change was needed}
- Authorized by: {Person or role who approved the change}
- Change: {Specific description of what was modified}
- Impact: {Analysis of effects on timeline, dependencies, other tasks}
```

### Examples

#### Task Splitting
```markdown
2024-01-15 16:00 - Split P2-T1 into separate tasks
- Reason: Discovered existing MCP tool registration conflicts with new implementation
- Authorized by: Development lead after architecture review
- Change: P2-T1 → P2-T1a (refactor existing pattern) + P2-T1b (implement new tool)
- Impact: +1 hour to Phase 2, no impact on completed P1 tasks
```

#### Task Modification
```markdown
2024-01-16 10:30 - Modified P3-T2 testing approach
- Reason: Steam API rate limiting prevents comprehensive integration testing
- Authorized by: Team decision due to external API constraints
- Change: Replaced full API testing with mock-based unit tests + limited integration tests
- Impact: -30 minutes to timeline, reduced testing coverage accepted
```

#### Task Addition
```markdown
2024-01-16 14:00 - Added new task P2-T3
- Reason: Client feedback revealed need for error logging functionality
- Authorized by: Product owner requirement change
- Change: Added P2-T3 (implement error logging middleware)
- Impact: +2 hours to Phase 2, affects P3-T1 integration work
```

## ADDENDUM System

### When to Use
- Modifying requirements for completed tasks
- Adding functionality to completed implementations
- Extending scope beyond original specification

### ADDENDUM File Format
```
ADDENDUM-{original-spec-id}-{sequence}-{description}.md
```

**Examples**:
- `ADDENDUM-SPEC-2024-01-15-steam-review-001-oauth.md`
- `ADDENDUM-SPEC-2024-01-16-user-auth-002-roles.md`

### ADDENDUM Structure
```markdown
# ADDENDUM: {Description}

**Original Specification**: SPEC-{date}-{original-description}.md
**Created**: {YYYY-MM-DD HH:MM}
**Status**: [Draft/Planning/In Progress/Completed]

## Relationship to Original
- References completed tasks: [P1-T1], [P2-T3]
- Extends functionality of: {specific components}
- Modifies behavior of: {specific features}

## New Requirements
{Follow standard requirements format}

## Additional Implementation
{Follow standard implementation format with new task IDs}

## Integration with Original
{Describe how new work integrates with completed work}
```

## Validation Rules

### Before Any Modification
1. **Check Progress Status**: Verify completion status of affected tasks
2. **Verify Permissions**: Ensure modification is allowed for current spec status
3. **Choose Pathway**: Select appropriate modification process
4. **Prepare Documentation**: Gather reason, authorization, impact analysis
5. **Validate Consistency**: Ensure changes maintain specification integrity

### After Modification
1. **Update Timestamps**: Modify "Last Updated" field
2. **Document Changes**: Add complete Change Log entry (if In Progress)
3. **Cross-Reference**: Update any references in related files
4. **Validate Format**: Ensure specification follows format standards
5. **Notify Stakeholders**: Inform relevant team members of changes

## Escalation Process

### Unauthorized Modifications
If modifications are attempted without proper authorization:
1. Reject the modification
2. Require proper authorization process
3. Document the attempted change
4. Escalate to appropriate decision-maker

### Conflicting Requirements
If modifications conflict with completed work:
1. Assess impact on completed tasks
2. Determine if ADDENDUM is required
3. Evaluate rollback vs. extension options
4. Make decision with appropriate stakeholders
5. Document resolution in Change Log

## Best Practices

### Planning Phase
- Complete thorough upfront planning to minimize execution changes
- Validate requirements with stakeholders before beginning implementation
- Design flexible implementation approach to accommodate likely changes

### Execution Phase
- Document all changes immediately when they occur
- Get proper authorization before making significant modifications
- Analyze impact on completed work before implementing changes
- Communicate changes to all stakeholders promptly

### Completion Phase
- Preserve completed specifications as historical records
- Use ADDENDUM system for any post-completion modifications
- Extract lessons learned for future specification improvements
