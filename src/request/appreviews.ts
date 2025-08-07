import type { Simplify } from 'type-fest'
import { z } from 'zod'
import { cleanHTMLText, steamFetch } from '../utils'

export const AppreviewsParamsSchema = z.object({
  appid: z.string().describe('Steam application ID'),
  filter: z.enum(['all', 'recent']).optional().describe('recent: sorted by creation time, updated: sorted by last updated time,all: (default) sorted by helpfulness, with sliding windows based on day_range parameter, will always find results to return.'),
  language: z.enum([
    'all', 'arabic', 'bulgarian', 'schinese', 'tchinese', 'czech', 'danish',
    'dutch', 'english', 'finnish', 'french', 'german', 'greek', 'hungarian',
    'indonesian', 'italian', 'japanese', 'koreana', 'norwegian', 'polish',
    'portuguese', 'brazilian', 'romanian', 'russian', 'spanish', 'latam',
    'swedish', 'thai', 'turkish', 'ukrainian', 'vietnamese',
  ]).optional().describe('Language filter (e.g. english, french, schinese). Default is all languages.'),
  day_range: z.number().optional().describe('range from now to n days ago to look for helpful reviews. Only applicable for the all filter.'),
  cursor: z.string().optional().describe('reviews are returned in batches of 20, so pass * for the first set, then the value of cursor that was returned in the response for the next set, etc. Note that cursor values may contain characters that need to be URLEncoded for use in the querystring.'),
  review_type: z.string().optional().describe('all:all reviews (default), positive: only positive reviews, negative: only negative reviews'),
  purchase_type: z.string().optional().describe('all: all reviews, non_steam_purchase: reviews written by users who did not pay for the product on Steam,steam: reviews written by users who paid for the product on Steam (default)'),
  num_per_page: z.number().optional().describe('number of reviews to get, max 100, default 50'),
})

type AppreviewsResponse = {
  success: number
  query_summary: Partial<{
    num_reviews: number
    review_score: number
    review_score_desc: string
    total_positive: number
    total_negative: number
    total_reviews: number
  }>
  reviews: {
    recommendationid: string
    author: object
    language: string
    review: string
    timestamp_created: number
    timestamp_updated: number
    voted_up: boolean
    votes_up: number
    votes_funny: number
    weighted_vote_score: string
    comment_count: number
    steam_purchase: boolean
    received_for_free: boolean
    written_during_early_access: boolean
    primarily_steam_deck: boolean
  }[]
}

type GetAppreviewsResult = Simplify<
  Pick<AppreviewsResponse, 'success'>
  & Pick<AppreviewsResponse['query_summary'], 'review_score' | 'review_score_desc' | 'total_positive' | 'total_negative' | 'total_reviews'>
  & { reviews: string[] }
>

export async function getAppreviews({
  appid,
  filter = 'all',
  language = 'all',
  day_range = 365,
  cursor = '*',
  review_type = 'all',
  purchase_type = 'steam',
  num_per_page = 50,
}: z.infer<typeof AppreviewsParamsSchema>): Promise<GetAppreviewsResult> {
  try {
    const reviewsData = await steamFetch<AppreviewsResponse>(`/appreviews/${appid}`, {
      query: { json: '1', filter, language, day_range, cursor, review_type, purchase_type, num_per_page },
    })

    return {
      success: reviewsData.success,
      review_score: reviewsData.query_summary?.review_score,
      review_score_desc: reviewsData.query_summary?.review_score_desc,
      total_positive: reviewsData.query_summary?.total_positive,
      total_negative: reviewsData.query_summary?.total_negative,
      reviews: reviewsData.reviews.map(review => cleanHTMLText(review.review)),
    }
  }
  catch (error: unknown) {
    console.error(error)
    throw error
  }
}
