import { decode } from 'entities'
import { parseHTML } from 'linkedom'
import { z } from 'zod'
import { languageSchema, termSchema } from '../baseSchema'
import { steamFetch } from '../utils'

export const AppsearchParamsSchema = z.object({
  term: termSchema,
  language: languageSchema,
})

export async function getAppsearch({
  term,
  language = 'english',
}: z.infer<typeof AppsearchParamsSchema>): Promise<{ appid: string, title: string }[]> {
  try {
    const resultHTML = await steamFetch<string>('/search/suggest', {
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      query: {
        term,
        l: language,
        f: 'games',
        realm: 1,
        cc: 'EN',
        use_store_query: 1,
        use_search_spellcheck: 1,
        search_creators_and_tags: 1,
      },
    })

    if (!resultHTML)
      return []

    const { document } = parseHTML(decode(resultHTML))

    const apps: { appid: string, title: string }[] = []
    let titleLike: string = ''
    for (const item of document.querySelectorAll('a[data-ds-appid]')) {
      const appid = item.getAttribute('data-ds-appid')
      const title = item.querySelector('div.match_name')?.textContent ?? ''

      if (!appid || !title)
        continue

      if (apps.length === 0) {
        apps.push({ appid, title })
        titleLike = title.toLowerCase()
      }
      else if (title.toLowerCase() === titleLike) {
        apps.push({ appid, title })
      }
    }

    return apps
  }
  catch (error: unknown) {
    console.error(error)
    throw error
  }
}
