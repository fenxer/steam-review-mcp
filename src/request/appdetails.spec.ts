import { describe, expect, it } from 'vitest'
import { getAppdetails } from './appdetails'

describe('steam appdetails api', () => {
  it('should throw an error if appid is not found', async () => {
    const appid = '1234567890'
    await expect(getAppdetails({ appids: appid }))
      .rejects
      .toThrowError()
  })

  it('should return app details', async () => {
    // Dota 2
    const appid = '570'
    const result = await getAppdetails({ appids: appid })
    // 只檢查格式，不檢查具體值
    expect(result).toMatchObject({
      name: expect.any(String),
      detailed_description: expect.any(String),
    })
  })

  it('should return no html tags in detailed_description', async () => {
    // Dota 2
    const appid = '570'
    const result = await getAppdetails({ appids: appid })
    expect(result.detailed_description).not.toMatch(/<[^>]+>/)
  })
})
