# Commit Style

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code formatting
- **refactor**: Code restructuring
- **test**: Tests
- **chore**: Maintenance
- **ai**: AI tools related configuration, especially for additions or changes related to `.context`, `.claude`, `AGENT.md`, or `CLAUDE.md`

## Scopes
- **api**: Steam API integration
- **tools**: MCP tool implementations
- **core**: MCP server core
- **deps**: Dependencies
- **build**: Config files and build

## Examples
```
feat(api): add review filtering by language
fix(tools): handle rate limiting properly
docs: update installation guide
refactor(core): extract validation logic
test(api): add steam API unit tests
chore(deps): update dependencies
ai: add new context about coding rules.
```

## Rules
- Use imperative mood ("add" not "added")
- Keep description under 50 characters
- No period at the end
