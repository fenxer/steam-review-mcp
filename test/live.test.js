import assert from "node:assert/strict";
import test from "node:test";
import { fetchSteamReview } from "../build/steam.js";

test("live GetAppReviews and GetItems for Dota 2", { timeout: 20000 }, async () => {
  const result = await fetchSteamReview({
    appid: "570",
    filter: "all",
    language: "all",
    day_range: 365,
    cursor: "*",
    review_type: "all",
    purchase_type: "steam",
    num_per_page: 1,
    display_language: "english",
  });

  assert.equal(result.game_info.name, "Dota 2");
  assert.match(result.game_info.detailed_description ?? "", /Dota/);
  assert.equal(typeof result.game_reviews.review_score, "number");
  assert.equal(typeof result.game_reviews.review_score_desc, "string");
  assert.equal(result.game_reviews.reviews.length, 1);
  assert.equal(typeof result.game_reviews.cursor, "string");
  assert.ok((result.game_reviews.total_reviews ?? 0) > 0);
});
