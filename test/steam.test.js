import assert from "node:assert/strict";
import test from "node:test";
import {
  buildReviewsInput,
  buildStoreInput,
  cleanReviewText,
  fetchSteamReview,
  normalizeReviewsPayload,
  normalizeStorePayload,
  stripBbcode,
} from "../build/steam.js";

const query = {
  appid: "570",
  filter: "recent",
  language: "schinese",
  day_range: 30,
  cursor: "*",
  review_type: "positive",
  purchase_type: "all",
  num_per_page: 1,
  display_language: "english",
};

test("maps the retired query-string enums into input_json", () => {
  assert.deepEqual(buildReviewsInput(query), {
    appid: 570,
    filter: 1,
    languages: ["schinese"],
    day_range: 30,
    cursor: "*",
    review_type: 1,
    purchase_type: 1,
    num_per_page: 1,
    display_language: "english",
  });
  assert.equal(buildReviewsInput({ ...query, filter: "funny", review_type: "negative", purchase_type: "non_steam_purchase" }).filter, 3);
  assert.equal(buildReviewsInput({ ...query, filter: "all", review_type: "all", purchase_type: "steam" }).purchase_type, 0);
  assert.deepEqual(buildStoreInput(query).ids, [{ appid: 570 }]);
});

test("treats an empty reviews response as null aggregates", () => {
  const reviews = normalizeReviewsPayload({ response: {} });
  assert.equal(reviews.success, true);
  assert.equal(reviews.review_score, null);
  assert.equal(reviews.total_positive, null);
  assert.deepEqual(reviews.reviews, []);
  assert.equal(reviews.cursor, null);
});

test("keeps score fields and the next cursor from the first page", () => {
  const reviews = normalizeReviewsPayload({
    response: {
      query_summary: {
        review_score: 8,
        review_score_desc: "Very Positive",
        total_positive: 10,
        total_negative: 2,
        total_reviews: 12,
      },
      reviews: [{ review: "<b>Great</b> game" }],
      cursor: "CURSOR*",
      day_range_used: 365,
      total_matching: 12,
    },
  });
  assert.equal(reviews.review_score_desc, "Very Positive");
  assert.equal(reviews.cursor, "CURSOR*");
  assert.equal(reviews.total_matching, 12);
  assert.deepEqual(reviews.reviews, ["Great game"]);
});

test("strips store bbcode without dropping the readable text", () => {
  assert.equal(
    stripBbcode("[b]Hello[/b]\r\n[url=https://example.com]Site[/url]"),
    "Hello\nSite",
  );
  const info = normalizeStorePayload({
    response: {
      store_items: [
        {
          success: 1,
          name: "Dota 2",
          full_description_bbcode: "[b]The most-played game[/b]",
          basic_info: { short_description: "Short" },
        },
      ],
    },
  });
  assert.equal(info.name, "Dota 2");
  assert.equal(info.detailed_description, "The most-played game");
});

test("cleanReviewText still flattens markup and quotes", () => {
  assert.equal(cleanReviewText("It's <i>good</i>"), "Its good");
});

test("fetchSteamReview reads both service methods and omits a missing key", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(String(url));
    const href = String(url);
    const body = href.includes("IUserReviewsService")
      ? { response: { query_summary: { review_score: 9, review_score_desc: "Overwhelmingly Positive", total_positive: 3, total_negative: 0, total_reviews: 3 }, reviews: [], cursor: "next" } }
      : { response: { store_items: [{ success: 1, name: "App", full_description_bbcode: "Desc" }] } };
    return new Response(JSON.stringify(body), { status: 200 });
  };

  const result = await fetchSteamReview(query, { fetchImpl, apiKey: "   " });
  assert.equal(calls.length, 2);
  assert.equal(calls.some((href) => href.includes("key=")), false);
  assert.equal(result.game_reviews.review_score, 9);
  assert.equal(result.game_info.name, "App");
  assert.equal(result.game_info.detailed_description, "Desc");
});

test("rejects a non-numeric app id before calling Steam", () => {
  assert.throws(() => buildReviewsInput({ ...query, appid: "dota" }), /Invalid Steam app id/);
});
