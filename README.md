# Steam Review MCP

[![smithery badge](https://smithery.ai/badge/@fenxer/steam-review-mcp)](https://smithery.ai/server/@fenxer/steam-review-mcp)

**English** | [中文](./README.zh.md)

Access Steam game reviews using Model Context Protocol (MCP).

<a href="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp/badge" alt="Steam Review MCP server" />
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


## Development

```bash
# Install dependencies
npm install

# Build project
npm run build

# Run service
npm start
```