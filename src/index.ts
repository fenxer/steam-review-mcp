#!/usr/bin/env node

import { pathToFileURL } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  DISPLAY_LANGUAGES,
  REVIEW_LANGUAGES,
  fetchSteamReview,
  type DisplayLanguage,
  type PurchaseType,
  type ReviewFilter,
  type ReviewLanguage,
  type ReviewQuery,
  type ReviewType,
  type SteamReviewResult,
} from "./steam.js";

const outputSchema = {
  game_reviews: z.object({
    success: z.boolean(),
    review_score: z.number().nullable(),
    review_score_desc: z.string().nullable(),
    total_positive: z.number().nullable(),
    total_negative: z.number().nullable(),
    total_reviews: z.number().nullable(),
    total_matching: z.number().nullable(),
    day_range_used: z.number().nullable(),
    cursor: z.string().nullable(),
    reviews: z.array(z.string()),
  }),
  game_info: z.object({
    name: z.string().nullable(),
    detailed_description: z.string().nullable(),
  }),
};

const inputSchema = {
  appid: z
    .string()
    .regex(/^[1-9]\d*$/)
    .describe("Steam application ID, for example 570."),
  filter: z
    .enum(["all", "recent", "updated", "funny"])
    .default("all")
    .describe(
      "Sort order. all: helpful within day_range (default). recent: creation time. updated: last update. funny: funny votes.",
    ),
  language: z
    .enum(REVIEW_LANGUAGES)
    .default("all")
    .describe(
      "Review language. all means every language. Any other value is sent as a one-item languages list. Default is all.",
    ),
  day_range: z
    .number()
    .int()
    .min(0)
    .max(365)
    .default(365)
    .describe(
      "Helpful filter only. Days back from today. 0 means no limit. Maximum 365. Default 365.",
    ),
  cursor: z
    .string()
    .default("*")
    .describe(
      "Pass * for the first page, then the cursor returned by the previous call. The server encodes it inside input_json.",
    ),
  review_type: z
    .enum(["all", "positive", "negative"])
    .default("all")
    .describe(
      "all (default), positive, or negative. Score totals are only returned when this is all.",
    ),
  purchase_type: z
    .enum(["steam", "all", "non_steam_purchase"])
    .default("steam")
    .describe(
      "steam: purchased on Steam (default). all: every review. non_steam_purchase: not purchased on Steam.",
    ),
  num_per_page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(50)
    .describe("Reviews to return on this page. Minimum 1, maximum 100, default 50."),
  display_language: z
    .enum(DISPLAY_LANGUAGES)
    .default("english")
    .describe(
      "Language of review_score_desc and the store description. Does not filter reviews. Default english.",
    ),
};

export interface ServerOptions {
  fetchImpl?: typeof fetch;
  apiKey?: string;
}

function queryFromParams(params: {
  appid: string;
  filter?: ReviewFilter;
  language?: ReviewLanguage;
  day_range?: number;
  cursor?: string;
  review_type?: ReviewType;
  purchase_type?: PurchaseType;
  num_per_page?: number;
  display_language?: DisplayLanguage;
}): ReviewQuery {
  return {
    appid: params.appid,
    filter: params.filter ?? "all",
    language: params.language ?? "all",
    day_range: params.day_range ?? 365,
    cursor: params.cursor ?? "*",
    review_type: params.review_type ?? "all",
    purchase_type: params.purchase_type ?? "steam",
    num_per_page: params.num_per_page ?? 50,
    display_language: params.display_language ?? "english",
  };
}

function toolResult(result: SteamReviewResult) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result, null, 2),
      },
    ],
    structuredContent: result as unknown as Record<string, unknown>,
  };
}

function toolError(error: unknown) {
  const message = error instanceof Error ? error.message : "Steam request failed";
  return {
    isError: true as const,
    content: [{ type: "text" as const, text: message }],
  };
}

function summaryPrompt(result: SteamReviewResult): string {
  return `You are an experienced video game industry professional and game developer who has played many games on Steam. You are skilled at summarizing a game's **pros** and **cons** from game reviews {{game_reviews}} combined with game descriptions {{game_info}}. List them in an unordered list format.
                    ====
                    # Features
                    - Don't extract too much information from a single review; try to summarize from **multiple reviews and multiple perspectives**.
                    - **Don't include too much game introduction content**; focus on finding common points in each review as game features.
                    - **Don't just summarize the game description content**; extract pros and cons from the reviews, keeping the content relevant.
                    ====
                    # Format
                    Pros:
                    - Pro 1
                    - Pro 2
                    Cons:
                    - Con 1
                    - Con 2
                    The unordered list format should be arranged from top to bottom according to the **number of times each pro or con is mentioned**.

                    Game Info: ${JSON.stringify(result.game_info, null, 2)}
                    Game Reviews: ${JSON.stringify(result.game_reviews.reviews, null, 2)}`;
}

function recentPrompt(result: SteamReviewResult): string {
  return `You are an experienced video game industry professional and game developer who has played many games on Steam. You are skilled at summarizing a game's **recent performance and player feedback** from the most recent game reviews {{game_reviews}} combined with game descriptions {{game_info}}. List them in an unordered list format.
                  ====
                  # Features
                  - Don't extract too much information from a single review; try to summarize from **multiple reviews and multiple perspectives**.
                  - **Don't include too much game introduction content**; focus on finding common points in each review as game features.
                  - **Don't just summarize the game description content**; extract pros and cons from the reviews, keeping the content relevant.
                  - Specifically focus on **recent changes, updates, and current player sentiment**.
                  ====
                  # Format
                  Pros:
                  - Pro 1
                  - Pro 2
                  Cons:
                  - Con 1
                  - Con 2
                  Current Player Sentiment:
                  - Key point about current state of the game
                  The unordered list format should be arranged from top to bottom according to the **number of times each point is mentioned**.

                  Game Info: ${JSON.stringify(result.game_info, null, 2)}
                  Game Reviews: ${JSON.stringify(result.game_reviews.reviews, null, 2)}`;
}

export function createServer(options: ServerOptions = {}): McpServer {
  const server = new McpServer({
    name: "steam-review-mcp",
    version: "1.1.0",
  });
  const apiKey = options.apiKey ?? process.env.STEAM_WEB_API_KEY;

  server.registerTool(
    "get_steam_review",
    {
      title: "Get Steam reviews",
      description:
        "Retrieves one page of Steam reviews and store information for an application. Uses IUserReviewsService/GetAppReviews and IStoreBrowseService/GetItems. Returns scores, totals, cleaned review text, the next cursor, and the store name plus description.",
      inputSchema,
      outputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (params) => {
      try {
        const result = await fetchSteamReview(queryFromParams(params), {
          fetchImpl: options.fetchImpl,
          apiKey,
        });
        return toolResult(result);
      } catch (error) {
        return toolError(error);
      }
    },
  );

  server.registerPrompt(
    "summarize-reviews",
    {
      title: "Summarize reviews",
      description: "Summarize the pros and cons of a Steam game from its reviews.",
      argsSchema: {
        appid: z
          .string()
          .regex(/^[1-9]\d*$/)
          .describe("Steam application ID"),
      },
    },
    async ({ appid }) => {
      const result = await fetchSteamReview(
        queryFromParams({
          appid,
          filter: "all",
          language: "all",
          purchase_type: "all",
          num_per_page: 50,
        }),
        { fetchImpl: options.fetchImpl, apiKey },
      );
      return {
        messages: [
          {
            role: "user" as const,
            content: { type: "text" as const, text: summaryPrompt(result) },
          },
        ],
      };
    },
  );

  server.registerPrompt(
    "recent-reviews-analysis",
    {
      title: "Recent reviews analysis",
      description:
        "Summarize recent player sentiment from the newest Steam reviews.",
      argsSchema: {
        appid: z
          .string()
          .regex(/^[1-9]\d*$/)
          .describe("Steam application ID"),
      },
    },
    async ({ appid }) => {
      const result = await fetchSteamReview(
        queryFromParams({
          appid,
          filter: "recent",
          language: "all",
          purchase_type: "all",
          num_per_page: 50,
        }),
        { fetchImpl: options.fetchImpl, apiKey },
      );
      return {
        messages: [
          {
            role: "user" as const,
            content: { type: "text" as const, text: recentPrompt(result) },
          },
        ],
      };
    },
  );

  return server;
}

const isDirectRun =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const server = createServer();
  const transport = new StdioServerTransport();
  server.connect(transport).catch((error: unknown) => {
    const message = error instanceof Error ? error.message : "MCP server failed to start";
    console.error(message);
  });
}
