import assert from "node:assert/strict";
import test from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createServer } from "../build/index.js";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function mockFetch(reviewsBody, storeBody, status = 200) {
  return async (url) => {
    const href = String(url);
    if (href.includes("key=")) {
      throw new Error("API key leaked into the request");
    }
    if (href.includes("IUserReviewsService")) return jsonResponse(reviewsBody, status);
    if (href.includes("IStoreBrowseService")) return jsonResponse(storeBody, status);
    throw new Error(`Unexpected Steam URL: ${href}`);
  };
}

async function connect(fetchImpl) {
  const server = createServer({ fetchImpl, apiKey: "" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "steam-review-test", version: "1.0.0" });
  await Promise.all([client.connect(clientTransport), server.connect(serverTransport)]);
  return client;
}

const reviewsBody = {
  response: {
    query_summary: {
      review_score: 8,
      review_score_desc: "Very Positive",
      total_positive: 4,
      total_negative: 1,
      total_reviews: 5,
    },
    reviews: [{ review: "Solid game" }],
    cursor: "next-page",
    total_matching: 5,
    day_range_used: 365,
  },
};

const storeBody = {
  response: {
    store_items: [
      {
        success: 1,
        name: "Dota 2",
        full_description_bbcode: "[b]Battle[/b]",
      },
    ],
  },
};

test("lists a read-only tool with an output schema for code mode", async () => {
  const client = await connect(mockFetch(reviewsBody, storeBody));
  const listed = await client.listTools();
  const tool = listed.tools.find((entry) => entry.name === "get_steam_review");
  assert.ok(tool);
  assert.equal(tool.annotations.readOnlyHint, true);
  assert.equal(tool.annotations.idempotentHint, true);
  assert.equal(tool.annotations.openWorldHint, true);
  assert.equal(tool.outputSchema.type, "object");
  assert.ok(tool.outputSchema.properties.game_reviews);
  assert.ok(tool.outputSchema.properties.game_info);
  await client.close();
});

test("returns structuredContent that matches the output schema", async () => {
  const client = await connect(mockFetch(reviewsBody, storeBody));
  const result = await client.callTool({
    name: "get_steam_review",
    arguments: { appid: "570" },
  });
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent.game_info.name, "Dota 2");
  assert.equal(result.structuredContent.game_info.detailed_description, "Battle");
  assert.equal(result.structuredContent.game_reviews.cursor, "next-page");
  assert.deepEqual(result.structuredContent.game_reviews.reviews, ["Solid game"]);
  const text = JSON.parse(result.content[0].text);
  assert.equal(text.game_reviews.review_score_desc, "Very Positive");
  await client.close();
});

test("turns a Steam failure into a catchable tool error", async () => {
  const client = await connect(mockFetch({}, {}, 429));
  const result = await client.callTool({
    name: "get_steam_review",
    arguments: { appid: "570" },
  });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /429/);
  await client.close();
});

test("prompts still build from the new payload", async () => {
  const client = await connect(mockFetch(reviewsBody, storeBody));
  const summary = await client.getPrompt({
    name: "summarize-reviews",
    arguments: { appid: "570" },
  });
  const recent = await client.getPrompt({
    name: "recent-reviews-analysis",
    arguments: { appid: "570" },
  });
  assert.match(summary.messages[0].content.text, /Pros:/);
  assert.match(summary.messages[0].content.text, /Solid game/);
  assert.match(recent.messages[0].content.text, /Current Player Sentiment:/);
  await client.close();
});
