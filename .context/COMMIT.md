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

### Critical (Must Follow)
- **Exact format matching**: Follow the format examples above EXACTLY - no additional lines
- **No extra content**: Do NOT add `🤖 Generated with [Claude Code]` or other Claude markers
- **Co-Authored-By only**: Only add `Co-Authored-By: Claude <noreply@anthropic.com>` line

### Essential
- Use imperative mood ("add" not "added")
- Keep description under 50 characters
- No period at the end
- Use defined types and scopes only

### Type Selection Rules
- **Priority**: Use specific types over general ones
- **File path mapping**: Match file paths to appropriate types:
  - `.context/`, `.claude/`, `AGENT.md`, `CLAUDE.md` → `context`
  - `*.md`, `README*`, documentation → `docs` (only if not AI-related)
  - Source code → `feat`, `fix`, `refactor`
- **Decision flow**:
  1. Check if file is AI configuration → use `context`
  2. Check if adding new functionality → use `feat`
  3. Check if fixing bugs → use `fix`
  4. Check if pure documentation → use `docs`
  5. Check if code restructuring → use `refactor`

### Pre-commit Checklist
- [ ] Correct type selected based on file path and change nature
- [ ] Format matches examples exactly (word-for-word)
- [ ] No additional lines beyond the format template
- [ ] Description uses imperative mood and is under 50 chars
- [ ] Tickets section only present if tickets argument provided
