# Steam Review MCP

**English** | [中文](./README.zh.md)

Access Steam game reviews using Model Context Protocol (MCP).

[![smithery badge](https://smithery.ai/badge/@fenxer/steam-review-mcp)](https://smithery.ai/server/@fenxer/steam-review-mcp)

<a href="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp/badge" />
</a>

## Features

Helps LLMs retrieve Steam game reviews and information:

- Get game reviews (positive/negative counts, review scores, review content, etc.)
- Get game basic information (name, detailed description)
- Analyze game reviews and summarize pros and cons

## Installation

### Installing via Smithery

To install Steam Review for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@fenxer/steam-review-mcp):

```bash
npx -y @smithery/cli install @fenxer/steam-review-mcp --client claude
```

Run it directly with npx:

```bash
npx steam-review-mcp
```

or add：

```json
{
  "mcpServers": {
    "steam-review-mcp": {
      "command": "npx",
      "args": [
        "steam-review-mcp"
      ]
    }
  }
}
```

## Usage

### Tools

This MCP service provides the `get_steam_review` tool, which retrieves reviews and game information by passing a Steam game appid.

For more details, check the Steamwork API: [User Reviews - Get List](https://partner.steamgames.com/doc/store/getreviews)

The returned data contains two parts:

1. `game_reviews`:
   - `success`: Whether the query was successful
   - `review_score`: Review score
   - `review_score_desc`: Review score description
   - `total_positive`: Total positive reviews
   - `total_negative`: Total negative reviews
   - `reviews`: All review text content (without other metadata)

2. `game_info`:
   - `name`: Game name
   - `detailed_description`: Detailed game description

### Prompts

#### summarize-reviews

For overall game review analysis, summarizing the pros and cons of the game.

##### Parameters

- `appid` (required): Steam game ID, e.g., `570` (Dota 2)

#### recent-reviews-analysis

For analyzing recent game reviews, summarizing the current state of the game and player feedback.

##### Parameters

- `appid` (required): Steam game ID, e.g., `570` (Dota 2)

## Development Guide
To ensure all developers use consistent tooling and versions, we strongly recommend following this guide.

### Environment Setup & Package Manager
Please make sure to check the packageManager field in the package.json file, and use either Corepack or the explicitly specified version of the corresponding package manager.

#### First-time Corepack Setup (Optional):

1. Check if Corepack is Installed

    For Node.js v18 and later, Corepack should be built-in. You can check it using:

```
npm list -g --depth=0 | grep corepack
```

2. Install Corepack

    If the command above not show Corepack, you can install the latest version of Corepack globally:

```
npm install corepack@latest -g
```

If any errors occur during this process or when enabling Corepack later, try resolving them by running the command above.

3. Enable Corepack Management for a Specific Package Manager

    Once Corepack is installed and present, you need to enable its automated management for the package manager used by the project. For instance, if our project uses pnpm (please check the packageManager field in package.json to confirm), run:

```
corepack enable pnpm
```

### Getting Started
1. Install Dependencies
```
pnpm install
```

2. Start the Development Server
```
pnpm dev
```
