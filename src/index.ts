import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const STEAM_API_BASE = "https://store.steampowered.com/";
const USER_AGENT = "steam-mcp/1.0";

// Create server instance
const server = new McpServer({
  name: "steam-review-mcp",
  version: "1.0.0",
});

// Define the schema for the input parameters
const SteamReviewParamsSchema = {
  appid: z.string().describe("Steam application ID"),
  filter: z.string().default("all").describe("recent: sorted by creation time, updated: sorted by last updated time,all: (default) sorted by helpfulness, with sliding windows based on day_range parameter, will always find results to return."),
  language: z.string().default("all").describe("Language filter, only steam API language code"),
  day_range: z.number().default(365).describe("range from now to n days ago to look for helpful reviews. Only applicable for the “all” filter."),
  cursor: z.string().default("*").describe("reviews are returned in batches of 20, so pass * for the first set, then the value of cursor that was returned in the response for the next set, etc. Note that cursor values may contain characters that need to be URLEncoded for use in the querystring."),
  review_type: z.string().default("all").describe("all:all reviews (default), positive: only positive reviews, negative: only negative reviews"),
  purchase_type: z.string().default("steam").describe("all: all reviews, non_steam_purchase: reviews written by users who did not pay for the product on Steam,steam: reviews written by users who paid for the product on Steam (default)"),
  num_per_page: z.number().default(30).describe("Number of reviews, max 100, default 30"),
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
        reviews: reviewsData.reviews ? reviewsData.reviews.map((review: any) => review.review) : []
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
            text: JSON.stringify({ game_reviews, game_info })
          }
        ]
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