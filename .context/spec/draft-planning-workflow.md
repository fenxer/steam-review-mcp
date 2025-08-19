# Draft/Planning Workflow

## When to Use This Workflow

- Creating a new specification from scratch
- Current spec status is "Draft" or "Planning"
- Requirements are being gathered and refined
- Implementation plan is being developed

## Workflow Steps

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

### Phase 3: Finalize Planning
- Review and validate the complete specification
- Ensure all requirements are clearly defined
- Confirm implementation plan is actionable
- Update status to "In Progress" when ready to begin execution

## File Structure Requirements

**📖 Detailed Format**: @.context/spec/format-standards.md

### Part 1: Requirements (Required)
- **Original Request**: Verbatim user requirements
- **Clarified Requirements**: Detailed functional and non-functional requirements
- **Assumptions**: Document assumptions made (Optional)
- **Dependencies**: External factors and constraints (Optional)
- **Success Criteria**: Measurable acceptance criteria (Optional)

### Part 2: Design & Planning (Required)
- **Context Analysis**: Existing codebase analysis
- **Design Approach**: High-level architectural decisions (Optional)
- **Implementation Plan**: Step-by-step execution roadmap with task IDs
- **Risk Assessment**: Potential issues and mitigation (Optional)
- **Validation Plan**: Testing and verification approach (Optional)

### Part 3: Progress Tracking (Setup)
- **Implementation Status**: Initialize with all tasks as pending
- **Completed Work**: Empty during planning phase
- **Issues & Blockers**: Document any planning-stage blockers
- **Change Log**: Should be empty (not activated until execution)

## Key Guidelines

### Task Identification System
- **Format**: [P1-T1], [P1-T2], [P2-T1], etc.
- **Purpose**: Enable precise cross-referencing between Implementation Plan and Progress Tracking
- **Requirement**: Every implementation step must have a unique identifier

### Planning Phase Rules
- Change Log is NOT active during planning
- All modifications to requirements and design are allowed
- Focus on comprehensive upfront planning to reduce implementation errors
- Status remains "Draft" or "Planning" until ready to begin implementation

## Transition to Execution

When planning is complete:
1. Review all sections for completeness
2. Validate task identifiers are consistent
3. Update status to "In Progress"
4. Begin following @.context/spec/in-progress-workflow.md
