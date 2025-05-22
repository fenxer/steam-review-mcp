import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageInfo from '../package.json'
import getSteamReview from './register/get-steam-review'
import recentReviewsAnalysis from './register/recent-reviews-analysis'
import summarizeReviews from './register/summarize-reviews'

const server = new McpServer({
  name: 'steam-review-mcp',
  version: packageInfo.version,
})

for (const register of [getSteamReview, recentReviewsAnalysis, summarizeReviews]) {
  switch (register.type) {
    case 'registerTool':
      server.registerTool(...register.options)
      break
    case 'prompt':
      server.prompt(...register.options)
      break
  }
}

const transport = new StdioServerTransport()
server.connect(transport).catch(console.error)
