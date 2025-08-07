# Steam Review MCP Architecture

## Tech Stack

### Runtime & Language
- **Node.js**: >=18.0.0
- **TypeScript**: ESNext target with ESM modules

### Package Management
- **pnpm**: Primary package manager with Corepack support

### Build & Development Tools
- **unbuild**: Modern TypeScript compilation (not tsc for output)
- **ESLint**: Code linting with @antfu/eslint-config
- **Vitest**: Unit testing framework

### Core Dependencies
- **MCP SDK**: Model Context Protocol server implementation
- **entities**: HTML entity encoding/decoding
- **striptags**: HTML tag removal for content cleaning

## Architecture

### Core Structure
- **Entry Point**: `src/index.ts` - MCP server initialization and registration
- **Tools/Prompts**: `src/register/` - Contains tool and prompt definitions
- **API Layer**: `src/request/` - Steam API interaction modules
- **Utilities**: `src/utils.ts` - Shared helper functions

### Registration Pattern
The server uses a modular registration system in `src/index.ts`:
- Tools and prompts are defined in separate modules under `src/register/`
- Each module exports an object with `type` ('registerTool' or 'prompt') and `options`
- Registration happens via a loop that calls the appropriate server method

### Key Components
- **get_steam_review** tool: Retrieves reviews and game info via `src/request/appreviews.ts`
- **Game details**: Fetched through `src/request/appdetails.ts`
- **Analysis prompts**: `summarize-reviews` and `recent-reviews-analysis`
- Uses `steamFetch` utility with HTML cleaning (`entities`, `striptags`)
