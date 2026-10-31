# Steam Review MCP

**English** | [中文](./README.zh.md)

Access Steam game reviews using Model Context Protocol (MCP).

[![MCP Badge](https://lobehub.com/badge/mcp/fenxer-steam-review-mcp)](https://lobehub.com/mcp/fenxer-steam-review-mcp)

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=steam-review-mcp&config=eyJjb21tYW5kIjoibnB4IHN0ZWFtLXJldmlldy1tY3AifQ%3D%3D)

<a href="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp/badge" />
</a>

## Features

Helps LLMs retrieve Steam game reviews and information:

- Get one page of game reviews (scores, totals, cleaned review text, and the next cursor)
- Get the store name and full description from `IStoreBrowseService/GetItems`
- Analyze game reviews and summarize pros and cons

## Installation

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

This MCP service provides the `get_steam_review` tool. Pass a Steam app id and the tool reads:

- [IUserReviewsService/GetAppReviews](https://partner.steamgames.com/doc/webapi/IUserReviewsService)
- [IStoreBrowseService/GetItems](https://steamapi.xpaw.me/IStoreBrowseService)

`store.steampowered.com/appreviews` was disabled on 2026-10-22. Parameters use the old string names (`all`, `recent`, `steam`) and the server maps them into `input_json`.

The tool returns text JSON and the same object as `structuredContent`:

1. `game_reviews`:
   - `success`: `true` when Steam returned a response object
   - `review_score`: Review score, or `null` when that page has no score
   - `review_score_desc`: Review score description
   - `total_positive`: Total positive reviews
   - `total_negative`: Total negative reviews
   - `total_reviews`: Positive plus negative totals
   - `total_matching`: Reviews matching the filter
   - `day_range_used`: Day range the Helpful filter actually searched
   - `cursor`: Pass this back to fetch the next page
   - `reviews`: Cleaned review text for this page

2. `game_info`:
   - `name`: Store name
   - `detailed_description`: Store description with BBCode removed

An empty Steam `response` means no matching reviews. Aggregates are `null` and `reviews` is empty. Set `STEAM_WEB_API_KEY` only when you need the higher rate limit. The public methods work without it.

### Code mode

The server stays compatible with Cloudflare's single-tool code mode as an upstream SDK v1 server. `get_steam_review` publishes an output schema, read-only annotations, and `structuredContent`. A host can wrap this server with `codeMcpServer()`. This package does not replace its tools with a `code` tool, because that wrapper is host-side and current code mode still serves the legacy SDK v1 handler.

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
