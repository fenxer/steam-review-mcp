import { getAppdetails } from '../request/appdetails'
import { AppreviewsParamsSchema, getAppreviews } from '../request/appreviews'
import { defineTool } from '../utils'

export default defineTool({
  name: 'get_steam_review',
  description: 'Retrieves reviews and game information for a specific Steam application. Returns formatted review data including review scores, positive/negative counts, review texts, and basic game information.',
  inputSchema: AppreviewsParamsSchema,
  async cb(params) {
    const reviews = await getAppreviews(params)
    const details = await getAppdetails({ appids: params.appid })
    return { content: [{ type: 'text', text: JSON.stringify({ game_reviews: reviews, game_info: details }, null, 2) }] }
  },
})
