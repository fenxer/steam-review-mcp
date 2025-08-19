# Spec File Format Standards

## File Naming Convention

```
SPEC-{YYYY-MM-DD}-{short-description}.md
```

**Examples**:
- `SPEC-2024-01-15-steam-review-api.md`
- `SPEC-2024-01-16-user-authentication.md`

## File Header Format

```markdown
# Spec: {Title}

**Created**: {YYYY-MM-DD HH:MM}
**Last Updated**: {YYYY-MM-DD HH:MM}
**Status**: [Draft/Planning/In Progress/Completed]

---
```

### Status Values
- **Draft**: Initial creation, requirements gathering
- **Planning**: Detailed planning and design phase
- **In Progress**: Active implementation
- **Completed**: Implementation finished

### Timestamp Format
- **Standard**: `YYYY-MM-DD HH:MM` (24-hour format, no seconds)
- **Example**: `2024-01-15 14:30`

## Part 1: Requirements

### Original Request (Required)
**Purpose**: Capture exact user request for traceability

**Format**:
```markdown
### Original Request (Required)
{Verbatim user request, preserving original formatting}
```

### Clarified Requirements (Required)
**Purpose**: Transform ambiguous requests into precise specifications

**Format**:
```markdown
### Clarified Requirements (Required)

Functional Requirements:
- FR1: System must retrieve Steam reviews for given app ID
- FR2: System must support filtering by review type

Non-Functional Requirements:
- NFR1: Response time must be under 5 seconds
- NFR2: Must handle rate limiting gracefully

Data Requirements:
- Input: Steam app ID (integer)
- Output: JSON array of review objects
```

### Assumptions (Optional)
**Format**:
```markdown
### Assumptions (Optional)
- A1: User has valid Steam app IDs (Confidence: High)
- A2: Existing API rate limits are acceptable (Confidence: Medium)
```

### Dependencies (Optional)
**Format**:
```markdown
### Dependencies (Optional)

Technical Dependencies:
- Steam Web API access
- Node.js 18+ runtime environment

External Dependencies:
- Steam API rate limits and availability

Project Dependencies:
- Existing MCP server architecture
```

### Success Criteria (Optional)
**Format**:
```markdown
### Success Criteria (Optional)

Functional Success Criteria:
- ✓ Successfully retrieves reviews for valid Steam app IDs
- ✓ Handles invalid app IDs with appropriate error messages

Performance Success Criteria:
- ✓ 95% of requests complete within 3 seconds
```

## Part 2: Design & Planning

### Context Analysis (Required)
**Purpose**: Understand existing codebase and technical context

**Format**:
```markdown
### Context Analysis (Required)

File Structure:
- src/tools/ - Contains MCP tool implementations
- src/types/ - TypeScript type definitions

Existing Patterns:
- Tools follow pattern: validation → API call → response formatting
- Error handling uses custom Error classes

Current Dependencies:
- @modelcontextprotocol/sdk for MCP server functionality
- zod for runtime validation

Architecture:
- MCP server with multiple tool handlers
- Each tool is self-contained with validation logic
```

### Implementation Plan (Required)
**Purpose**: Detailed step-by-step roadmap with task identifiers

**Task Identification System**:
- **Format**: [P1-T1], [P1-T2], [P2-T1], etc.
- **Purpose**: Enable cross-referencing between Implementation Plan and Progress Tracking
- **Requirement**: Every implementation step must have unique identifier

**Format**:
```markdown
### Implementation Plan (Required)

Phase 1: Core Infrastructure (2-3 hours)
1. [P1-T1] Create src/types/steam-review.ts - Define TypeScript interfaces
   - Review object structure
   - API response types
   - Tool parameter types

2. [P1-T2] Create src/utils/steam-api.ts - Steam API client utilities
   - HTTP request wrapper with error handling
   - Rate limiting logic

Testing Checkpoint: Unit tests for utilities and types

Phase 2: Integration (1-2 hours)
3. [P2-T1] Update src/index.ts - Register new tool with MCP server
   - Import new tool
   - Add to tool registry

Validation: Tool works end-to-end in MCP environment
```

### Optional Sections
- **Design Approach**: High-level architectural decisions
- **Risk Assessment**: Potential issues and mitigation strategies
- **Validation Plan**: Testing and verification approach

## Part 3: Progress Tracking

### Implementation Status (Required)
**Purpose**: Track progress using task identifiers from Implementation Plan

**Format**:
```markdown
### Implementation Status

Phase 1: Core Infrastructure
- [x] [P1-T1]: Create src/types/steam-review.ts ✅ Completed 2024-01-15 14:30
- [x] [P1-T2]: Create src/utils/steam-api.ts ✅ Completed 2024-01-15 15:45
- [ ] [P1-T3]: Create src/tools/steam-review-tool.ts (In Progress - 60% complete)

Phase 2: Integration
- [ ] [P2-T1]: Update src/index.ts (Blocked - waiting for Phase 1 completion)
- [ ] [P2-T2]: Create tests/steam-review.spec.ts (Pending)
```

**Requirements**:
- Task identifiers must exactly match Implementation Plan
- Include completion timestamps for finished tasks
- Reference specific file changes or commits
- Mark blocked tasks with blocker information

### Completed Work (Required)
**Purpose**: Chronological record of finished tasks with links

**Format**:
```markdown
### Completed Work

1. ✅ Created TypeScript interfaces (src/types/steam-review.ts)
   - Commit: abc123f
   - Added Review, ReviewResponse interfaces
   - Decision: Used Steam Web API v1 response format

2. ✅ Implemented Steam API client (src/utils/steam-api.ts)
   - Commit: def456a
   - Added rate limiting with exponential backoff
   - Deviation: Used fetch instead of axios
```

### Issues & Blockers (Required)
**Purpose**: Track obstacles and their resolution

**Format**:
```markdown
### Issues & Blockers

Active Blockers:
🔴 HIGH: Steam API key not configured
- Impact: Cannot run integration tests
- Resolution: Requested API key from team lead
- ETA: 2024-01-16 (1 day)

Resolved Issues:
✅ Rate limiting implementation complexity
- Resolution: Used existing exponential backoff pattern
- Resolved: 2024-01-15 15:30
```

### Change Log (Status-Dependent)
**Activation**: Only active when status is "In Progress"

**Format**:
```markdown
### Change Log

2024-01-15 16:00 - Split P2-T1 into separate tasks
- Reason: Discovered existing MCP tool registration conflicts
- Authorized by: Development lead after architecture review
- Change: P2-T1 → P2-T1a (refactor) + P2-T1b (implement new)
- Impact: +1 hour to Phase 2, no impact on completed P1 tasks
```

**Requirements**:
- Document reason for plan modification
- Include authorization information
- Specify exact changes made
- Analyze impact on timeline and dependencies

## Formatting Rules

### General
- Use Markdown formatting consistently
- Include timestamps in `YYYY-MM-DD HH:MM` format
- Use checkbox format `- [x]` for completed items
- Use task identifiers `[P1-T1]` for all implementation references

### Content Organization
- Use clear section headers with (Required) or (Optional) indicators
- Include purpose statements for each major section
- Provide format examples where helpful
- Maintain consistent indentation and bullet point styles

### Cross-References
- Reference other spec files using relative paths
- Use `@.context/spec/filename.md` format for internal references
- Ensure all links and references are valid and up-to-date
