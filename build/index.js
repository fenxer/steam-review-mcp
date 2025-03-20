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
    filter: z.string().default("all").describe("Filter type"),
    language: z.string().default("all").describe("Language filter"),
    day_range: z.number().default(365).describe("Day range"),
    cursor: z.string().default("*").describe("Cursor"),
    review_type: z.string().default("all").describe("Review type"),
    purchase_type: z.string().default("all").describe("Purchase type"),
    num_per_page: z.number().default(50).describe("Number of results per page"),
};
// Add the tool to get steam reviews
server.tool("get_steam_review", SteamReviewParamsSchema, async (params) => {
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
        // Extract required review information
        const game_reviews = {
            success: reviewsData.success,
            review_score: reviewsData.query_summary?.review_score,
            review_score_desc: reviewsData.query_summary?.review_score_desc,
            total_positive: reviewsData.query_summary?.total_positive,
            total_negative: reviewsData.query_summary?.total_negative,
            reviews: reviewsData.reviews || []
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
// Start the server
const transport = new StdioServerTransport();
server.connect(transport).catch(console.error);
console.log("Steam Review MCP Server started");
