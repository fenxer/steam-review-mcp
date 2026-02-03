# Spec: MCP Entry Template for Steam Review Tools

**Created**: 2025-08-18 09:00:00
**Last Updated**: 2025-08-18 09:00:00
**Status**: Planning

---

## Part 1: Requirements

### Original Request (Required)
Create an MCP entry template that describes tool invocation scenarios under different conditions and their return formats. Currently need to
support two modes: appid and term. The appid mode will directly call the existing get-steam-review.tool, while the term-based mode requires creating a new tool that calls appsearch to obtain necessary data. Regardless of which approach is used, there should be two output formats in the end: one for recent reviews summary and one for all game reviews summary. Consider reusing parts of the content from recent-reviews.analysis.prompt and summarize-reviews.prompt files.

### Clarified Requirements (Required)

**Functional Requirements:**
- FR1: Create MCP entry template supporting both appid and term input modes
- FR2: Support direct appid mode using existing get-steam-review.tool
- FR3: Support term-based search mode using appsearch functionality
- FR4: Provide two output formats: recent reviews summary and all reviews summary
- FR5: Reuse existing prompt templates (recent-reviews.analysis.prompt and summarize-reviews.prompt)
- FR6: Document tool invocation patterns and return formats for different scenarios

**Non-Functional Requirements:**
- NFR1: Template should be reusable across different MCP implementations
- NFR2: Clear documentation of API contracts and data structures
- NFR3: Maintain compatibility with existing tool architecture
- NFR4: Follow project coding standards and patterns

**Data Requirements:**
- Input: Steam app ID (string) OR search term (string)
- Output: Structured review summaries in two formats (recent vs all reviews)
- Integration: Steam Web API responses, app search results

**Interface Requirements:**
- Tool interface compatible with MCP standard
- Consistent parameter validation schemas
- Standardized response formats across both modes

### Assumptions (Optional)
- A1: Existing get-steam-review.tool functionality is stable and can be reused (Confidence: High)
- A2: appsearch module provides reliable game search functionality (Confidence: High)
- A3: Recent reviews and summarize reviews prompts contain reusable logic (Confidence: High)
- A4: MCP clients expect consistent tool interfaces regardless of input mode (Confidence: Medium)

### Dependencies (Optional)

**Technical Dependencies:**
- Existing get-steam-review.tool implementation
- appsearch module for term-based searches
- recent-reviews.analysis.prompt template
- summarize-reviews.prompt template
- MCP SDK and tool definition utilities

**External Dependencies:**
- Steam Web API availability and rate limits
- Steam store search functionality

**Project Dependencies:**
- Current MCP server architecture
- Existing validation schemas and error handling patterns

### Success Criteria (Optional)

**Functional Success Criteria:**
- ✓ Template supports both appid and term input modes seamlessly
- ✓ Term mode successfully finds games using appsearch and retrieves reviews
- ✓ Both output formats (recent/all reviews) work correctly
- ✓ Existing prompt templates are properly integrated

**Quality Success Criteria:**
- ✓ All TypeScript types are properly defined
- ✓ Input validation follows existing patterns
- ✓ Error handling covers edge cases (invalid terms, no search results)
- ✓ Code follows project linting and formatting rules

---

## Part 2: Design & Planning

### Context Analysis (Required)

**File Structure:**
- `src/building-block/` - Contains MCP tool implementations and prompts
- `src/request/` - API request handlers (appreviews, appdetails, appsearch)
- `src/utils/` - Shared utilities including tool definition helpers

**Existing Patterns:**
- Tools use `defineTool()` helper with name, description, inputSchema, and callback
- Prompts use `definePrompt()` helper with name, argsSchema, and callback
- Input validation uses Zod schemas
- API responses are wrapped in MCP-compatible format with content array

**Current Dependencies:**
- `@modelcontextprotocol/sdk` for MCP server functionality
- `zod` for runtime validation and schema definition
- Custom utilities for Steam API integration

**Architecture:**
- Modular tool design with separate handlers
- Shared validation and error handling utilities
- Consistent response formatting across tools

### Implementation Plan (Required)

**Phase 1: Create Term-Based Search Tool (2-3 hours)**
1. [P1-T1] Create `src/building-block/search-steam-games.tool.ts`
   - Define input schema accepting search term
   - Use appsearch to find matching games
   - Return structured list of games with appids and titles
   - Handle case where no games are found

2. [P1-T2] Create unified input schema supporting both modes
   - Create `src/types/steam-review-input.ts`
   - Define discriminated union for appid vs term inputs
   - Export shared validation schemas

**Phase 2: Create MCP Entry Template Tool (3-4 hours)**
3. [P2-T1] Create `src/building-block/steam-review-template.tool.ts`
   - Accept either appid or term as input
   - Route to appropriate handler based on input type
   - For term input: use appsearch then get reviews for first match
   - For appid input: directly call existing review functionality
   - Support output format parameter (recent vs all)

4. [P2-T2] Create response formatter utilities
   - Create `src/utils/review-formatter.ts`
   - Extract common formatting logic from existing prompts
   - Support both recent and all reviews formatting
   - Maintain consistency with existing prompt outputs

**Phase 3: Integration and Testing (1-2 hours)**
5. [P3-T1] Update `src/building-block/index.ts`
   - Export new tools and utilities
   - Ensure proper module organization

6. [P3-T2] Create comprehensive tests
   - Test both appid and term input modes
   - Test both output formats
   - Test error handling (invalid inputs, no search results)
   - Integration test with actual Steam API calls

**Testing Checkpoints:**
- After Phase 1: Term-based search works independently
- After Phase 2: Full template tool works end-to-end
- After Phase 3: All tests pass and integration verified

### Risk Assessment (Optional)

**Medium Risk:**
- R1: appsearch may return no results for obscure terms
  Mitigation: Implement graceful error handling and user feedback
  Contingency: Provide search suggestions or fuzzy matching

- R2: Term input may match multiple games with same name
  Mitigation: Return first exact match following existing appsearch logic
  Contingency: Allow user to specify additional criteria

**Low Risk:**
- R3: Performance impact from additional API calls in term mode
  Mitigation: Consider caching search results
  Contingency: Add optional caching layer if needed

---

## Part 3: Progress Tracking

### Implementation Status

**Phase 1: Term-Based Search Tool**
- [ ] P1-T1: Create src/building-block/search-steam-games.tool.ts (Pending)
- [ ] P1-T2: Create src/types/steam-review-input.ts (Pending)

**Phase 2: MCP Entry Template Tool**
- [ ] P2-T1: Create src/building-block/steam-review-template.tool.ts (Pending)
- [ ] P2-T2: Create src/utils/review-formatter.ts (Pending)

**Phase 3: Integration and Testing**
- [ ] P3-T1: Update src/building-block/index.ts (Pending)
- [ ] P3-T2: Create comprehensive test suite (Pending)

### Issues & Blockers
**No current blockers identified**

### Change Log
**No entries** - Implementation Plan execution has not yet begun.
