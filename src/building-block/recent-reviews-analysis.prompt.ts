import { z } from 'zod'
import { getAppdetails } from '../request/appdetails'
import { getAppreviews } from '../request/appreviews'
import { definePrompt } from '../utils'

export default definePrompt({
  name: 'recent-reviews-analysis',
  argsSchema: z.object({ appid: z.string().describe('Steam application ID') }),
  async cb({ appid }) {
    const reviews = await getAppreviews({ appid, filter: 'recent', purchase_type: 'all' })
    const details = await getAppdetails({ appids: appid })
    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: `You are an experienced video game industry professional and game developer who has played many games on Steam. You are skilled at summarizing a game's **recent performance and player feedback** from the most recent game reviews {{game_reviews}} combined with game descriptions {{game_info}}. List them in an unordered list format.
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

                Game Info: ${JSON.stringify(details, null, 2)}
                Game Reviews: ${JSON.stringify(reviews.reviews, null, 2)}`,
        },
      }],
    }
  },

})
