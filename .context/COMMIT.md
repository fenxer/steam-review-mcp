# Commit Style

## Arguments

- **tickets**: Usually refers to the problem being resolved, for easier management and follow-up. Can be a single ticket number or multiple ticket numbers separated by commas.

## Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation
- **style**: Code formatting
- **refactor**: Code restructuring
- **test**: Tests
- **chore**: Maintenance
- **context**: AI related configuration changes (e.g., .context, .claude, AGENT.md, CLAUDE.md)

## Scopes

- **api**: Steam API integration
- **tools**: MCP tool implementations
- **core**: MCP server core
- **deps**: Dependencies
- **build**: Config files and build

## Format

- `<type>`: Required commit type
- `<scope>`: Optional scope (recommended)
- `<description>`: Required short description
- `close: #[ticket]`: One line per ticket (only if tickets argument provided)

For empty ticket:
```
<type>(<scope>): <description>

Co-Authored-By: Claude <noreply@anthropic.com>
```

For single ticket:
```
<type>(<scope>): <description>

close: #[ticket]

Co-Authored-By: Claude <noreply@anthropic.com>
```

For multiple tickets:
```
<type>(<scope>): <description>

close: #[ticket1]
close: #[ticket2]
close: #[ticket3]

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Rules

- Use imperative mood ("add" not "added")
- Keep description under 50 characters
- No period at the end
