# Spec Mode Guidelines

## 1. Purpose

Spec Mode is a specification-driven development workflow that follows a structured approach: Requirement → Context Collection & Detailed Planning → Persistent Planning Documentation → Implementation

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

## 3. Planning File Location
All spec mode planning files are stored in the `.spec/` directory at project root:

```
.spec/
├── SPEC-{YYYY-MM-DD}-{short-description}.md
├── SPEC-{YYYY-MM-DD}-{short-description}.md
└── ...
```

## 4. New planning File Format

### Unified Spec File Format
Each specification file contains all three components in a single document:

```markdown
# Spec: {Title}

**Created**: {YYYY-MM-DD HH:MM}
**Last Updated**: {YYYY-MM-DD HH:MM}
**Status**: [Draft/Planning/In Progress/Completed]

---

## Part 1: Requirements

### Original Request (Required)
**Purpose**: Capture the exact user request to maintain traceability and context.

**Content Guidelines**:
- Copy the user's request word-for-word, preserving original formatting
- If the request spans multiple messages, include all relevant parts chronologically
- Include any clarifying questions asked by the user
- Mark any unclear or ambiguous language with [UNCLEAR] annotations
- If user provides examples, include them in full

**Minimum Content**:
- Complete original text of the user's request
- Timestamp of when the request was made
- Context about how the request was delivered (chat, email, etc.)

### Clarified Requirements (Required)
**Purpose**: Transform ambiguous requests into precise, implementable specifications.

**Content Guidelines**:
- Break down complex requests into discrete functional requirements
- Define all technical terms and specifications
- Specify input/output formats, data types, and expected behaviors
- Identify edge cases and error conditions
- Define scope boundaries (what is included/excluded)
- Use bullet points for clarity and organization

**Minimum Content**:
- Functional requirements (what the system must do)
- Non-functional requirements (performance, usability, etc.)
- Data requirements (input/output specifications)
- Interface requirements (APIs, UI elements, etc.)
- Constraint specifications (technical limitations, business rules)

**Format Example**:
```
Functional Requirements:
- FR1: System must retrieve Steam reviews for given app ID
- FR2: System must support filtering by review type (positive/negative/all)

Non-Functional Requirements:
- NFR1: Response time must be under 5 seconds
- NFR2: Must handle rate limiting gracefully

Data Requirements:
- Input: Steam app ID (integer)
- Output: JSON array of review objects
```

### Assumptions (Optional)
**Purpose**: Document assumptions made during requirement clarification.

**Content Guidelines**:
- List all assumptions made about user intent
- Include assumptions about technical environment
- Document assumptions about existing system behavior
- Note assumptions about data availability and format
- Mark confidence level for each assumption (High/Medium/Low)

**Format Example**:
```
- A1: User has valid Steam app IDs (Confidence: High)
- A2: Existing API rate limits are acceptable (Confidence: Medium)
- A3: JSON output format matches existing patterns (Confidence: High)
```

### Dependencies (Optional)
**Purpose**: Identify external factors that could impact implementation.

**Content Guidelines**:
- List external APIs, services, or systems required
- Identify required libraries, frameworks, or tools
- Note environmental dependencies (Node.js version, OS requirements)
- Include configuration dependencies (environment variables, config files)
- Specify team/organizational dependencies (access permissions, approvals)

**Format Example**:
```
Technical Dependencies:
- Steam Web API access
- Node.js 18+ runtime environment
- TypeScript 5.0+ compiler

External Dependencies:
- Steam API rate limits and availability
- Network connectivity requirements

Project Dependencies:
- Existing MCP server architecture
- Current authentication mechanisms
```

### Success Criteria (Optional)
**Purpose**: Define measurable criteria for implementation success.

**Content Guidelines**:
- Create testable acceptance criteria
- Define performance benchmarks
- Specify quality standards
- Include user experience criteria
- Set measurable goals with specific metrics

**Format Example**:
```
Functional Success Criteria:
- ✓ Successfully retrieves reviews for valid Steam app IDs
- ✓ Handles invalid app IDs with appropriate error messages
- ✓ Supports all documented filter parameters

Performance Success Criteria:
- ✓ 95% of requests complete within 3 seconds
- ✓ Handles 100 concurrent requests without errors

Quality Success Criteria:
- ✓ All unit tests pass
- ✓ Code coverage above 90%
- ✓ No ESLint errors or warnings
```

---

## Part 2: Design & Planning

### Context Analysis (Required)
**Purpose**: Understand the existing codebase and technical context for informed implementation decisions.

**Content Guidelines**:
- Analyze relevant existing code structures and patterns
- Identify current architecture and design patterns in use
- Document existing similar implementations for reference
- Note current coding standards, naming conventions, and style patterns
- Identify available utilities, helpers, and reusable components
- Document current testing patterns and frameworks

**Minimum Content**:
- File structure analysis (where new code should be placed)
- Existing pattern analysis (how similar features are implemented)
- Dependency analysis (what libraries/frameworks are currently used)
- Architecture analysis (how the change fits into current system design)

**Format Example**:
```
File Structure:
- src/tools/ - Contains MCP tool implementations
- src/types/ - TypeScript type definitions
- src/utils/ - Shared utility functions

Existing Patterns:
- Tools follow pattern: validation → API call → response formatting
- Error handling uses custom Error classes with typed messages
- All async operations use Promise-based patterns

Current Dependencies:
- @modelcontextprotocol/sdk for MCP server functionality
- zod for runtime validation
- node-fetch for HTTP requests

Architecture:
- MCP server with multiple tool handlers
- Each tool is self-contained with validation and execution logic
- Shared utilities for common operations (logging, error handling)
```

### Design Approach (Optional)
**Purpose**: Document high-level design decisions and architectural choices.

**Content Guidelines**:
- Explain chosen design patterns and their rationale
- Document architectural decisions (modular vs monolithic, sync vs async)
- Describe data flow and system interactions
- Justify technology choices and trade-offs
- Explain interface designs and API contracts

**Format Example**:
```
Architecture Pattern: Modular Tool Design
- Each Steam API endpoint gets its own tool handler
- Shared validation and error handling utilities
- Consistent response formatting across all tools

Data Flow Design:
1. MCP client sends tool request
2. Tool handler validates input parameters
3. Steam API client makes HTTP request
4. Response processor formats data
5. Formatted response returned to MCP client

Technology Choices:
- TypeScript for type safety and better developer experience
- Zod for runtime validation (already used in project)
- Native fetch for HTTP requests (Node.js 18+ support)
```

### Implementation Plan (Required)
**Purpose**: Provide a detailed, step-by-step roadmap for implementation that can be followed precisely.

**Content Guidelines**:
- Break down work into discrete, actionable steps
- Order steps logically with dependencies clearly marked
- **Assign unique task identifiers** using [Phase-Task] format (e.g., P1-T1, P2-T3)
- Specify exact files to be created, modified, or deleted
- Include testing steps and validation points
- Provide estimated time or complexity for each step
- Include rollback steps for high-risk changes

**Minimum Content**:
- Sequential numbered steps for implementation with unique task identifiers
- File-level changes (create/modify/delete specific files)
- Testing checkpoints after major changes
- Integration points with existing code
- Final validation steps

**Task Identification System**:
- **Format**: [Phase-Task] where Phase = P1, P2, P3... and Task = T1, T2, T3...
- **Purpose**: Enable precise cross-referencing between Implementation Plan and Progress Tracking
- **Requirement**: Every implementation step must have a unique identifier
- **Example**: [P1-T1], [P1-T2], [P2-T1], [P2-T2], [P3-T1]

**Format Example**:
```
Implementation Steps:

Phase 1: Core Infrastructure (2-3 hours)
1. [P1-T1] Create src/types/steam-review.ts - Define TypeScript interfaces
   - Review object structure
   - API response types
   - Tool parameter types

2. [P1-T2] Create src/utils/steam-api.ts - Steam API client utilities
   - HTTP request wrapper with error handling
   - Rate limiting logic
   - Response validation

3. [P1-T3] Create src/tools/steam-review-tool.ts - Main tool implementation
   - Tool registration and metadata
   - Parameter validation using zod
   - API integration logic

Testing Checkpoint: Unit tests for utilities and types

Phase 2: Integration (1-2 hours)
4. [P2-T1] Update src/index.ts - Register new tool with MCP server
   - Import new tool
   - Add to tool registry
   - Update server configuration

5. [P2-T2] Create tests/steam-review.spec.ts - Comprehensive test suite
   - Unit tests for all functions
   - Integration tests with mock API responses
   - Error handling validation

Testing Checkpoint: Full test suite passes

Phase 3: Documentation and Validation (30 minutes)
6. [P3-T1] Update package.json - Add any new dependencies
7. [P3-T2] Update README.md - Document new tool capabilities
8. [P3-T3] Final integration testing with actual MCP client

Validation: Tool works end-to-end in MCP environment
```

### Risk Assessment (Optional)
**Purpose**: Identify potential issues and define mitigation strategies.

**Content Guidelines**:
- Identify technical risks (breaking changes, performance issues)
- Assess external dependencies and failure modes
- Consider security implications and data privacy concerns
- Evaluate impact on existing functionality
- Define contingency plans for each identified risk

**Format Example**:
```
High Risk:
- R1: Steam API rate limiting could cause tool failures
  Mitigation: Implement exponential backoff and request queuing
  Contingency: Graceful degradation with cached responses

Medium Risk:
- R2: Breaking changes to existing MCP tool interface
  Mitigation: Thorough testing with existing clients
  Contingency: Version compatibility layer

Low Risk:
- R3: Performance impact from additional API calls
  Mitigation: Response caching and lazy loading
  Contingency: Feature toggle for performance-sensitive environments
```

### Validation Plan (Optional)
**Purpose**: Define how to verify that implementation meets all requirements.

**Content Guidelines**:
- Create specific test scenarios for each requirement
- Define acceptance criteria validation steps
- Include both automated and manual testing approaches
- Specify performance testing methods
- Plan integration testing with real environments

**Format Example**:
```
Automated Validation:
- Unit tests: 95% code coverage for all new modules
- Integration tests: All API endpoints return expected data structures
- Error handling tests: All error conditions handled gracefully

Manual Validation:
- End-to-end testing with Claude Desktop MCP client
- Performance testing with 100 concurrent requests
- Error scenario testing with invalid Steam app IDs

Acceptance Testing:
- FR1: ✓ Retrieve reviews for valid Steam app ID 730 (CS2)
- FR2: ✓ Handle invalid app ID -1 with appropriate error
- NFR1: ✓ Response time under 3 seconds for 95% of requests
- NFR2: ✓ No memory leaks during extended operation

Performance Benchmarks:
- API response time: < 3 seconds average
- Memory usage: < 100MB increase during operation
- Error rate: < 1% for valid requests
```

---

## Part 3: Progress Tracking

### Implementation Status
**Purpose**: Track progress of each implementation step with precise status updates.

**Content Guidelines**:
- Use consistent checkbox format for all tasks
- **Reference Implementation Plan tasks using task identifiers** (e.g., P1-T1, P2-T3)
- Include completion timestamps for finished tasks
- Reference specific file changes or commits where applicable
- Mark blocked tasks with blocker information
- Update status in real-time as work progresses

**Minimum Content**:
- All implementation steps from Part 2 as trackable items using task identifiers
- Clear status indicators (pending/in-progress/completed/blocked)
- Completion timestamps for finished work
- References to actual code changes or commits

**Task Tracking Requirements**:
- **Mandatory**: Every task must reference its Implementation Plan identifier
- **Format**: [x] [P1-T1]: Brief task description ✅ Completed YYYY-MM-DD HH:MM
- **Consistency**: Task identifiers must exactly match those in Implementation Plan
- **Benefit**: Eliminates duplicate task descriptions and maintains clear traceability

**Format Example**:
```
Phase 1: Core Infrastructure
- [x] [P1-T1]: Create src/types/steam-review.ts ✅ Completed 2024-01-15 14:30
- [x] [P1-T2]: Create src/utils/steam-api.ts ✅ Completed 2024-01-15 15:45
- [ ] [P1-T3]: Create src/tools/steam-review-tool.ts (In Progress - 60% complete)

Phase 2: Integration
- [ ] [P2-T1]: Update src/index.ts (Blocked - waiting for Phase 1 completion)
- [ ] [P2-T2]: Create tests/steam-review.spec.ts (Pending)

Phase 3: Documentation
- [ ] [P3-T1]: Update package.json (Pending)
- [ ] [P3-T2]: Update README.md (Pending)
```

### Completed Work
**Purpose**: Maintain a record of all finished tasks with links to actual changes.

**Content Guidelines**:
- List all completed tasks chronologically
- Include links to commits, PRs, or file changes
- Note any deviations from original plan
- Record lessons learned or important decisions made

**Format Example**:
```
Completed Tasks:
1. ✅ Created TypeScript interfaces (src/types/steam-review.ts)
   - Commit: abc123f
   - Added Review, ReviewResponse, and ToolParameters interfaces
   - Decision: Used Steam Web API v1 response format

2. ✅ Implemented Steam API client (src/utils/steam-api.ts)
   - Commit: def456a
   - Added rate limiting with exponential backoff
   - Deviation: Used fetch instead of axios (already available in Node 18+)

3. ✅ Created comprehensive test suite (tests/steam-review.spec.ts)
   - Commit: ghi789b
   - 95% code coverage achieved
   - All error scenarios covered
```

### Issues & Blockers
**Purpose**: Track and manage obstacles that impact implementation progress.

**Content Guidelines**:
- Document all current blockers with severity levels
- Include steps taken to resolve each issue
- Note escalation paths for unresolved blockers
- Track resolution status and timeline estimates

**Format Example**:
```
Active Blockers:
🔴 HIGH: Steam API key not configured
- Impact: Cannot run integration tests
- Resolution: Requested API key from team lead
- ETA: 2024-01-16 (1 day)
- Escalation: Will contact Steam directly if not resolved by ETA

🟡 MEDIUM: TypeScript compilation warnings in legacy code
- Impact: Build process shows warnings
- Resolution: Investigating compatibility with newer TS version
- ETA: 2024-01-18 (3 days)
- Workaround: Suppress warnings in tsconfig.json

Resolved Issues:
✅ Rate limiting implementation complexity
- Resolution: Used existing exponential backoff pattern
- Resolved: 2024-01-15 15:30
```

### Change Log
**Purpose**: Document Implementation Plan adjustments made during execution phase to maintain transparency and protect completed work integrity.

**When to Use**:
- Only activated after Implementation Plan execution begins
- Records adjustments to planned tasks, not routine progress updates
- Does NOT record changes made during initial planning phase

**Modification Process Requirements**:
- When modifying an already executing Implementation Plan, **MUST** provide:
  - **Reason**: Clear justification for why the change is necessary
  - **Authorized by**: Who approved/authorized this modification
- After plan adjustment, **MUST** synchronize and document:
  - **Change**: Specific modifications made to the original plan
  - **Impact**: Effects on timeline, dependencies, and previously completed tasks

**Content Guidelines**:
- Document reason for plan modification (discovery, blocker, requirement change)
- Specify what adjustments were made to the original plan
- Note impact on timeline and previously completed tasks
- Include who authorized the change and when
- Reference related discussions or external factors

**Format Example**:
```
2024-01-15 16:00 - Split P2-T1 into separate tasks
- Reason: Discovered existing MCP tool registration conflicts with new implementation
- Authorized by: Development lead after architecture review
- Change: P2-T1 → P2-T1a (refactor existing pattern) + P2-T1b (implement new tool)
- Impact: +1 hour to Phase 2, no impact on completed P1 tasks

2024-01-16 10:30 - Modified P3-T2 testing approach
- Reason: Steam API rate limiting prevents comprehensive integration testing
- Authorized by: Team decision due to external API constraints
- Change: Replaced full API testing with mock-based unit tests + limited integration tests
- Impact: -30 minutes to timeline, reduced testing coverage accepted

2024-01-16 14:00 - Added new task P2-T3
- Reason: Client feedback revealed need for error logging functionality
- Authorized by: Product owner requirement change
- Change: Added P2-T3 (implement error logging middleware)
- Impact: +2 hours to Phase 2, affects P3-T1 integration work
```

## 5. Planning File Modification Rules

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
