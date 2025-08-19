# Spec Standards Review Process

## Process Overview

### Purpose
Ensure all spec standards modifications are properly reviewed and approved before implementation.

### Core Principle
**Timestamped Reviews**: Each review session creates a timestamped file. Only one PENDING status review can exist at a time.

## Review Lifecycle

### States
1. **PENDING** - Changes awaiting review
2. **APPROVED** - Changes approved and implemented
3. **REJECTED** - Changes rejected, reverted if necessary

### Workflow
```
Standards Modification
         ↓
Create REVIEW-{YYYY-MM-DD-HH-MM}.md
         ↓
Review & Decision
    ↓         ↓
APPROVED   REJECTED
    ↓         ↓
Move to    Move to
Archive    Archive
```

## File Management

### Directory Structure
```
.context/spec/review/
├── REVIEW-2024-08-19-15-30.md (PENDING)
├── REVIEW-2024-08-20-09-15.md (PENDING)
└── archive/
    ├── REVIEW-2024-08-15-14-20.md (APPROVED)
    └── REVIEW-2024-08-17-11-45.md (REJECTED)
```

### Active Review Files
**Location**: `.context/spec/review/REVIEW-{YYYY-MM-DD-HH-MM}.md`
**Status**: PENDING APPROVAL
**Access**: Editable until review process begins

### Completed Review Archive
**Location**: `.context/spec/review/archive/REVIEW-{YYYY-MM-DD-HH-MM}.md`
**Purpose**: Historical record of completed reviews
**Content**: Final state of review with approval/rejection decision

### Review Template Structure
```markdown
# Spec Standards Pending Review

**Status**: PENDING APPROVAL
**Created**: {YYYY-MM-DD HH:MM}
**Last Updated**: {YYYY-MM-DD HH:MM}

## Change Summary
### Modification Reason
### Modification Goal
### Modification Direction

## Detailed Changes
### New Files Created
### Modified Files
### Key Features Introduced

## Review Checklist
[Detailed approval criteria]

## Risk Assessment
[Impact and mitigation analysis]

## Approval Decision
[Reviewer signature and decision]
```

## Prevention Mechanisms

### Pre-Modification Verification Protocol
**CRITICAL**: All modifications to `.context/spec/` files must follow this verification:

#### Step 1: Identify Modification Type
Before making any changes:
```
Is this modifying any file in .context/spec/?
├─ YES → Continue to Step 2
└─ NO → Proceed with normal development
```

#### Step 2: Scope Assessment
Determine modification scope:
```
What type of modification is this?
├─ New standards or rules → REQUIRES REVIEW
├─ Process clarification → REQUIRES REVIEW
├─ Format/template changes → REQUIRES REVIEW
├─ Cross-reference updates → REQUIRES REVIEW
├─ Typo/grammar fixes → REQUIRES REVIEW
└─ Any other .md file changes in .context/spec/ → REQUIRES REVIEW
```

**Rule**: ALL modifications to spec standards files require review process.

#### Step 3: Mandatory Review Check
```bash
# Check for existing PENDING reviews
ls .context/spec/review/ | grep -v archive
# If files exist with PENDING status → Add to existing review
# If no PENDING files → Create new review file
```

#### Step 4: Documentation Requirement
**BEFORE making changes**: Document in review file
**AFTER making changes**: Update review file with actual modifications

### Violation Prevention
- **No Direct Edits**: Never edit spec files without review documentation
- **No Exception Cases**: All modifications follow same process regardless of urgency
- **Immediate Documentation**: Changes must be recorded in review file within same session

## Modification Workflow

### Step 1: Pre-Modification Check
Before making any spec standards changes:
1. Check if any PENDING review files exist in `.context/spec/review/`
2. If exists: Add changes to most recent PENDING review file
3. If missing: Create new `REVIEW-{YYYY-MM-DD-HH-MM}.md` file

### Step 2: Create/Update Review File
For new modifications:
1. **Create Review File**: Use timestamp format `REVIEW-{YYYY-MM-DD-HH-MM}.md`
2. **Set Status**: Mark as "PENDING APPROVAL"
3. **Document Changes**: Include reason, goal, direction, specific file changes
4. **Update Review Checklist**: Add relevant review criteria
5. **Assess Risks**: Document potential impacts and mitigations

### Step 3: Review Process
When ready for review:
1. **Notify Reviewer**: Alert appropriate stakeholder
2. **Provide Reviewer Information**: Reviewer MUST fill in their name, role, and review date
3. **Complete Review**: Reviewer works through checklist
4. **Make Decision**: Approve, conditionally approve, or reject
5. **Document Decision**: Record decision in review file with complete reviewer identification

### Step 4: Post-Review Actions

#### If Approved
1. **Update Status**: Change to "APPROVED" in review file
2. **Move to Archive**: Move to `.context/spec/review/archive/`
3. **Implement Changes**: Apply any final modifications if needed
4. **Update References**: Ensure all cross-references are current
5. **Notify Team**: Communicate approved changes

#### If Rejected
1. **Revert Changes**: Undo all modifications in review
2. **Update Status**: Change to "REJECTED" with reasoning
3. **Move to Archive**: Move to `.context/spec/review/archive/`
4. **Plan Alternative**: Determine alternative approach if needed

## Workflow Integration

### Blocking Mechanism
When PENDING review files exist in `.context/spec/review/`:
1. **Spec Mode Entry Points**: Block access with review requirement message
2. **Workflow Files**: Add warning about pending reviews

### Check Implementation
Add to workflow entry points:
```markdown
## ⚠️ PENDING REVIEW CHECK

Before proceeding, verify no pending spec standards reviews:

1. Check for files in `.context/spec/review/` with PENDING status
2. If pending reviews exist: Complete review process before using spec workflows
3. If no pending reviews: Proceed with spec work

**BLOCKED**: Spec workflows unavailable during pending reviews.
```

## Review Responsibilities

### Modification Author
- Document all changes in PENDING-REVIEW.md
- Ensure complete and accurate change description
- Include rationale and impact analysis
- Notify reviewer when ready

### Reviewer
- **MUST provide reviewer identification**: Fill in Reviewer name, Role, and Review Date fields
- Complete thorough review using provided checklist
- Make clear approval/rejection decision
- Document reasoning for decision
- Handle post-review file management

**Required Reviewer Information**:
- Reviewer name (actual person conducting review)
- Role (position/authority level for approval)
- Review Date (when review was completed)

### Team Members
- Check for pending reviews before spec work
- Report any standards issues for future review
- Participate in review process when requested

## Quality Standards

### Complete Change Documentation
- [ ] All file modifications listed with line numbers
- [ ] Clear reason and goal for each change
- [ ] Impact analysis for affected workflows
- [ ] Risk assessment with mitigation plans
- [ ] **Pre-modification verification completed**: Confirmed review process followed

### Prevention Mechanism Compliance
- [ ] **No direct edits made**: All changes documented in review file first
- [ ] **Scope assessment completed**: Modification type identified correctly
- [ ] **Review check performed**: Verified PENDING review status before changes

### Thorough Review Process
- [ ] **Reviewer identification completed**: Name, role, and date provided
- [ ] All checklist items addressed
- [ ] Decision rationale documented
- [ ] Alternative approaches considered
- [ ] Implementation plan verified

### Proper File Management
- [ ] Only one PENDING-REVIEW.md at any time
- [ ] Approved reviews properly archived
- [ ] Rejected changes reverted completely
- [ ] Cross-references maintained

## Emergency Procedures

### Urgent Standards Fix
If critical fix needed during pending review:
1. **Document Emergency**: Add to existing PENDING-REVIEW.md
2. **Mark as Urgent**: Clear priority and deadline
3. **Expedited Review**: Fast-track review process
4. **Implement Immediately**: Apply fix after expedited approval

### Review Process Breakdown
If review process fails or reviewer unavailable:
1. **Escalation Path**: Identify backup reviewer
2. **Timeout Procedure**: Auto-approval after defined period if specified
3. **Emergency Override**: Documented override with post-hoc review

---

**Implementation Note**: This process must be integrated into all spec workflow files to ensure enforcement.
