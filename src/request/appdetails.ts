import type { Simplify } from 'type-fest'
import { z } from 'zod'
import { cleanHTMLText, steamFetch } from '../utils'

export const AppdetailsParamsSchema = z.object({
  appids: z.string().describe('Steam application ID'),
})

type AppdetailsResponse = {
  [appid: string]: {
    success: boolean
    data?: {
      name: string
      detailed_description: string
      short_description: string
    }
  }
}

type GetAppdetailsResult = Simplify<Pick<NonNullable<AppdetailsResponse[string]['data']>, 'name' | 'detailed_description'>>

export async function getAppdetails(params: z.infer<typeof AppdetailsParamsSchema>): Promise<GetAppdetailsResult> {
  try {
    const details = await steamFetch<AppdetailsResponse>('/api/appdetails', { query: { appids: params.appids } })
    if (details[params.appids]?.success !== true) {
      throw new Error(`There is no details info for appid: ${params.appids}`)
    }
    const desc = details[params.appids]?.data?.detailed_description
    return {
      name: details[params.appids]?.data?.name ?? '',
      detailed_description: desc ? cleanHTMLText(desc) : '',
    }
  }
  catch (error: unknown) {
    console.error(error)
    throw error
  }
}
