# Steam Review MCP Code Rules

## Code Standards

- Type definitions preferred over interfaces (`ts/consistent-type-definitions`)
- ESM imports/exports exclusively
- ESLint auto-formatting with @antfu/eslint-config
- Modular organization: tools/prompts in separate modules
- Utility-first: shared functions centralized in `src/utils.ts`
- Consistent error handling across API calls

## Linting Notes

- Lint commands (`pnpm lint`, `pnpm lint:fix`) are NOT run automatically
- Only run when explicitly instructed or preparing commits
- Build outputs to `build/` directory
