import { describe, expect, it } from 'vitest'
import { getAppsearch } from './appsearch'

describe('steam appsearch api', () => {
  it('should return search results', async () => {
    const result = await getAppsearch({ term: 'dota' })
    expect(result.length).toBeGreaterThan(0)
  })

  it('should return empty array for non-existing term', async () => {
    const result = await getAppsearch({ term: 'thereisnothing' })
    expect(result).toEqual([])
  })
})
