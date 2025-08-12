import { describe, expect, it } from 'vitest'
import { getAppreviews } from './appreviews'

describe('steam appreviews api', () => {
  it('should return empty reviews array if appid is not found', async () => {
    const appid = '0123456789'
    const result = await getAppreviews({ appid })
    expect(result.reviews).toEqual([])
  })

  it('should return app reviews', async () => {
    // Dota 2
    const appid = '570'
    const result = await getAppreviews({ appid })
    // 只檢查格式，不檢查具體值
    expect(result).toMatchObject({
      success: expect.any(Number),
      review_score: expect.any(Number),
      review_score_desc: expect.any(String),
      total_positive: expect.any(Number),
      total_negative: expect.any(Number),
      reviews: expect.any(Array),
    })
    expect(result.reviews.length).toBeGreaterThan(0)
    expect(result.reviews[0]).toEqual(expect.any(String))
  })

  it('should return no html tags in reviews', async () => {
    // Dota 2
    const appid = '570'
    const result = await getAppreviews({ appid })
    result.reviews.forEach((review) => {
      expect(review).not.toMatch(/<[^>]+>/)
    })
  })
})
