---
name: steam-review-mcp
description: Fetches Steam review text and store descriptions through steam-review-mcp using IUserReviewsService/GetAppReviews and IStoreBrowseService/GetItems. Use when calling get_steam_review, updating this MCP, summarizing Steam reviews, or wrapping the server for MCP code mode. Do not call the retired store.steampowered.com/appreviews endpoint.
---

# Steam Review MCP

`store.steampowered.com/appreviews/<appid>` was disabled on 2026-10-22. `store.steampowered.com/api/appdetails` is not the store source for this server. Call the service methods below. A Web API key is optional.

## Tools

Use `get_steam_review` for one page of reviews plus the store name and description. Pass string enums; the server maps them into `input_json`.

| Tool argument | Steam `input_json` |
| --- | --- |
| `filter=all` | `filter: 0` (Helpful). Also `recent: 1`, `updated: 2`, `funny: 3`. |
| `language=schinese` | `languages: ["schinese"]`. `all` means every language. Omitting the list would mean English only, so always send the argument. |
| `review_type=all` | `review_type: 0`. Score fields are omitted unless this is `all` and the page is the first page. `positive: 1`, `negative: 2`. |
| `purchase_type=steam` | `purchase_type: 0` (default). `all: 1`. `non_steam_purchase: 2`. |
| `day_range` | Helpful filter only. `0` means no limit. Maximum `365`. |
| `cursor` | `*` on the first page, then the returned `cursor`. Do not URL-encode it yourself. |
| `num_per_page` | `1`–`100`. `0` omits `query_summary`; do not send it. |

Review endpoint:

```text
GET https://api.steampowered.com/IUserReviewsService/GetAppReviews/v1/?input_json=...
```

Store endpoint, one known App ID only:

```text
GET https://api.steampowered.com/IStoreBrowseService/GetItems/v1/?input_json=...
```

Read `STEAM_WEB_API_KEY` from the environment when a higher rate limit is needed. Never log it, and do not put it in source. A missing key is not a failure. HTTP 429 is a stop, not a cue to retry in a loop.

The response has no `success` field. HTTP 200 with a `response` object is success. An empty `response` means no matching reviews: keep null aggregates and an empty `reviews` array. Do not invent zeros.

`get_steam_review` returns cleaned review text. That is intentional for this tool. Do not also store author SteamIDs, vote records, or the raw review objects. Pass `cursor` to the next call when another page is required. `total_matching` is the filtered total. `total_reviews` is the score denominator and does not follow `day_range`.

`summarize-reviews` uses helpful reviews. `recent-reviews-analysis` uses the recent filter. Both purchase types are `all`.

## Code mode

This process stays a normal SDK v1 stdio server. Cloudflare code mode wraps an existing server with `codeMcpServer()` and serves that wrapper through `createLegacyMcpHandler`. Do not replace `get_steam_review` with a `code` tool here. Cursor and other clients call the named tool directly, and `codeMcpServer()` currently expects the SDK v1 `McpServer`, not the SDK 2 package.

For a host to wrap this server, keep these properties:

- Register tools with Zod `inputSchema` and `outputSchema`.
- Return the same object as `structuredContent` and as JSON `content`. Code mode exposes `structuredContent` to generated JavaScript. Text-only JSON is only the fallback.
- Mark the tool `readOnlyHint`, `idempotentHint`, and `openWorldHint`. It has no local side effects and it calls Steam.
- Return `isError: true` with a short message for Steam failures so generated code can catch them. Do not include the request URL.
- Keep the result to one page. Generated code can pass a smaller `num_per_page` or follow `cursor` instead of receiving every review at once.

Search-and-execute code mode is for large OpenAPI catalogs. This server has one read tool, so the single-tool wrapper is the compatible pattern.
