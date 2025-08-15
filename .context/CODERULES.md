# Steam Review MCP Code Rules

## Rule Management

### Adding New Rules Process

When adding new rules, follow this process and standardized format:

1. **Identify Rule Structure** - Each rule must include:
   - **RULE NAME**: Brief descriptive name in ALL CAPS
   - Purpose: Clear explanation of why this rule exists
   - Scope: What files/code types this applies to
   - Priority: Priority level and enforcement requirements

2. **Specify Priority Level** - Choose from available priority levels:
   - **Critical Rules**: Must be followed strictly
   - **Important Rules**: Should be prioritized in implementation
   - **Suggested Rules**: Flexible recommendations

3. **Complete Rule Definition** - Ensure all required components are provided before adding the rule

When AI adds supplementary rules, actively prompt the user to specify the priority level and present the available priority levels above if not explicitly provided.

## Critical Rules

- **MODULAR ORGANIZATION**: Keep tools/prompts in separate modules
  - Purpose: Maintain clean code architecture and separation of concerns
  - Scope: All source code files
  - Priority: Critical - Must be followed strictly

- **UTILITY FIRST APPROACH**: Centralize shared functions in `src/utils.ts`
  - Purpose: Avoid code duplication and maintain consistency
  - Scope: All utility functions and shared code
  - Priority: Critical - Must be followed strictly

- **ESM ONLY**: Use ES modules exclusively, no CommonJS
  - Purpose: Modern JavaScript standards and better tree-shaking
  - Scope: All import/export statements
  - Priority: Critical - Must be followed strictly

- **NO AUTOMATIC LINTING**: Never automatically execute lint commands during code changes
  - Purpose: Reduce AI execution time; most linting only affects formatting, not functionality
  - Scope: All code modifications
  - Priority: Critical - Must be followed strictly

## Important Rules

- **BUILD DIRECTORY STRUCTURE**: Build outputs to `build/` directory
  - Purpose: Maintain consistent build structure across the project
  - Scope: All build configurations and outputs
  - Priority: Important - Should be prioritized in implementation

## Suggested Rules

- **TYPE OVER INTERFACE**: Use `type` instead of `interface`
  - Purpose: Consistent type definitions following ts/consistent-type-definitions rule
  - Scope: All TypeScript type definitions
  - Priority: Suggested - Flexible recommendation
