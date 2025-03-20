import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const STEAM_API_BASE = "https://store.steampowered.com/";
const USER_AGENT = "steam-mcp/1.0";

// Helper function to clean and format review text for JSON
function cleanReviewText(text: string): string {
  if (!text) return "";
  
  // Remove HTML tags
  let cleanText = text.replace(/<\/?[^>]+(>|$)/g, "");
  
  // Decode common HTML entities
  cleanText = cleanText.replace(/&amp;/g, "&")
                       .replace(/&lt;/g, "<")
                       .replace(/&gt;/g, ">")
                       .replace(/&quot;/g, "")
                       .replace(/&#39;/g, "")
                       .replace(/&nbsp;/g, " ");
  
  // Handle newlines and other control characters
  cleanText = cleanText.replace(/\r\n/g, "\\n")
                       .replace(/\n/g, "\\n")
                       .replace(/\r/g, "\\n");
  
  // Remove quotes
  cleanText = cleanText.replace(/["']/g, "");
  
  // Replace multiple spaces with a single space
  cleanText = cleanText.replace(/\s+/g, " ");
  
  // Trim extra spaces
  return cleanText.trim();
}

// Create server instance
const server = new McpServer({
  name: "steam-review-mcp",
  version: "1.0.0",
});

// Define the schema for the input parameters
const SteamReviewParamsSchema = {
  appid: z.string().describe("Steam application ID"),
  filter: z.string().default("all").describe("recent: sorted by creation time, updated: sorted by last updated time,all: (default) sorted by helpfulness, with sliding windows based on day_range parameter, will always find results to return."),
  language: z.enum([
    "all", "arabic", "bulgarian", "schinese", "tchinese", "czech", "danish", 
    "dutch", "english", "finnish", "french", "german", "greek", "hungarian", 
    "indonesian", "italian", "japanese", "koreana", "norwegian", "polish", 
    "portuguese", "brazilian", "romanian", "russian", "spanish", "latam", 
    "swedish", "thai", "turkish", "ukrainian", "vietnamese"
  ]).default("all").describe("Language filter (e.g. english, french, schinese). Default is all languages."),
  day_range: z.number().default(365).describe("range from now to n days ago to look for helpful reviews. Only applicable for the all filter."),
  cursor: z.string().default("*").describe("reviews are returned in batches of 20, so pass * for the first set, then the value of cursor that was returned in the response for the next set, etc. Note that cursor values may contain characters that need to be URLEncoded for use in the querystring."),
  review_type: z.string().default("all").describe("all:all reviews (default), positive: only positive reviews, negative: only negative reviews"),
  purchase_type: z.string().default("steam").describe("all: all reviews, non_steam_purchase: reviews written by users who did not pay for the product on Steam,steam: reviews written by users who paid for the product on Steam (default)"),
  num_per_page: z.number().default(50).describe("number of reviews to get, max 100, default 50"),
};

// Add the tool to get steam reviews
server.tool(
  "get_steam_review",
  SteamReviewParamsSchema,
  async (params) => {
    try {
      // Fetch game reviews
      const reviewsUrl = new URL(`appreviews/${params.appid}`, STEAM_API_BASE);
      reviewsUrl.searchParams.append("json", "1");
      reviewsUrl.searchParams.append("filter", params.filter);
      reviewsUrl.searchParams.append("language", params.language);
      reviewsUrl.searchParams.append("day_range", params.day_range.toString());
      reviewsUrl.searchParams.append("cursor", params.cursor);
      reviewsUrl.searchParams.append("review_type", params.review_type);
      reviewsUrl.searchParams.append("purchase_type", params.purchase_type);
      reviewsUrl.searchParams.append("num_per_page", params.num_per_page.toString());
      
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
      }
      
      const reviewsData = await reviewsResponse.json();
      
      // Extract required review information and review texts
      const game_reviews = {
        success: reviewsData.success,
        review_score: reviewsData.query_summary?.review_score,
        review_score_desc: reviewsData.query_summary?.review_score_desc,
        total_positive: reviewsData.query_summary?.total_positive,
        total_negative: reviewsData.query_summary?.total_negative,
        reviews: reviewsData.reviews ? reviewsData.reviews.map((review: any) => cleanReviewText(review.review)) : []
      };
      
      // Fetch game info
      const infoUrl = new URL("api/appdetails", STEAM_API_BASE);
      infoUrl.searchParams.append("appids", params.appid);
      
      const infoResponse = await fetch(infoUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!infoResponse.ok) {
        throw new Error(`Failed to fetch game info: ${infoResponse.statusText}`);
      }
      
      const infoData = await infoResponse.json();
      
      // Extract required game information
      const game_info = {
        name: infoData[params.appid]?.data?.name,
        detailed_description: infoData[params.appid]?.data?.detailed_description
      };
      
      // Return combined result in the format expected by MCP
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ game_reviews, game_info }, null, 2)
          }
        ]
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Add prompt for analyzing reviews
server.prompt(
  "summarize-reviews",
  { appid: z.string().describe("Steam application ID") },
  async ({ appid }) => {
    try {
      // Fetch game reviews and info
      const reviewsUrl = new URL(`appreviews/${appid}`, STEAM_API_BASE);
      reviewsUrl.searchParams.append("json", "1");
      reviewsUrl.searchParams.append("filter", "all");
      reviewsUrl.searchParams.append("language", "all");
      reviewsUrl.searchParams.append("day_range", "365");
      reviewsUrl.searchParams.append("cursor", "*");
      reviewsUrl.searchParams.append("review_type", "all");
      reviewsUrl.searchParams.append("purchase_type", "all");
      reviewsUrl.searchParams.append("num_per_page", "50");
      
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
      }
      
      const reviewsData = await reviewsResponse.json();
      
      // Extract required review information and review texts
      const game_reviews = {
        success: reviewsData.success,
        review_score: reviewsData.query_summary?.review_score,
        review_score_desc: reviewsData.query_summary?.review_score_desc,
        total_positive: reviewsData.query_summary?.total_positive,
        total_negative: reviewsData.query_summary?.total_negative,
        reviews: reviewsData.reviews ? reviewsData.reviews.map((review: any) => cleanReviewText(review.review)) : []
      };
      
      // Fetch game info
      const infoUrl = new URL("api/appdetails", STEAM_API_BASE);
      infoUrl.searchParams.append("appids", appid);
      
      const infoResponse = await fetch(infoUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!infoResponse.ok) {
        throw new Error(`Failed to fetch game info: ${infoResponse.statusText}`);
      }
      
      const infoData = await infoResponse.json();
      
      // Extract required game information
      const game_info = {
        name: infoData[appid]?.data?.name,
        detailed_description: infoData[appid]?.data?.detailed_description
      };
      
      // Return prompt with game data
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `You are an experienced game industry professional and game developer who has played many games on Steam. You are skilled at summarizing a game's **pros** and **cons** from game reviews {{game_reviews}} combined with game descriptions {{game_info}}. List them in an unordered list format.
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

                    Game Info: ${JSON.stringify(game_info, null, 2)}
                    Game Reviews: ${JSON.stringify(game_reviews.reviews, null, 2)}`
          }
        }]
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Add prompt for analyzing recent reviews
server.prompt(
  "recent-reviews-analysis",
  { appid: z.string().describe("Steam application ID") },
  async ({ appid }) => {
    try {
      // Fetch game reviews and info
      const reviewsUrl = new URL(`appreviews/${appid}`, STEAM_API_BASE);
      reviewsUrl.searchParams.append("json", "1");
      reviewsUrl.searchParams.append("filter", "recent");
      reviewsUrl.searchParams.append("language", "all");
      reviewsUrl.searchParams.append("day_range", "365");
      reviewsUrl.searchParams.append("cursor", "*");
      reviewsUrl.searchParams.append("review_type", "all");
      reviewsUrl.searchParams.append("purchase_type", "all");
      reviewsUrl.searchParams.append("num_per_page", "50");
      
      const reviewsResponse = await fetch(reviewsUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!reviewsResponse.ok) {
        throw new Error(`Failed to fetch reviews: ${reviewsResponse.statusText}`);
      }
      
      const reviewsData = await reviewsResponse.json();
      
      // Extract required review information and review texts
      const game_reviews = {
        success: reviewsData.success,
        review_score: reviewsData.query_summary?.review_score,
        review_score_desc: reviewsData.query_summary?.review_score_desc,
        total_positive: reviewsData.query_summary?.total_positive,
        total_negative: reviewsData.query_summary?.total_negative,
        reviews: reviewsData.reviews ? reviewsData.reviews.map((review: any) => cleanReviewText(review.review)) : []
      };
      
      // Fetch game info
      const infoUrl = new URL("api/appdetails", STEAM_API_BASE);
      infoUrl.searchParams.append("appids", appid);
      
      const infoResponse = await fetch(infoUrl, {
        headers: { "User-Agent": USER_AGENT }
      });
      
      if (!infoResponse.ok) {
        throw new Error(`Failed to fetch game info: ${infoResponse.statusText}`);
      }
      
      const infoData = await infoResponse.json();
      
      // Extract required game information
      const game_info = {
        name: infoData[appid]?.data?.name,
        detailed_description: infoData[appid]?.data?.detailed_description
      };
      
      // Return prompt with game data
      return {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: `You are an experienced game industry professional and game developer who has played many games on Steam. You are skilled at summarizing a game's **recent performance and player feedback** from the most recent game reviews {{game_reviews}} combined with game descriptions {{game_info}}. List them in an unordered list format.
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

                  Game Info: ${JSON.stringify(game_info, null, 2)}
                  Game Reviews: ${JSON.stringify(game_reviews.reviews, null, 2)}`
          }
        }]
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// Start the server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);

console.log("Steam Review MCP Server started");