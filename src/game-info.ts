import axios from 'axios';
import { GetGameInfoInput, GameInfoResponse } from './types';

/**
 * 从Steam获取游戏基本信息
 * @param input 查询参数
 * @returns 游戏基本信息
 */
export async function getGameInfo(input: GetGameInfoInput): Promise<GameInfoResponse> {
  // 设置请求头，模拟浏览器行为
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://store.steampowered.com/',
    'Cache-Control': 'no-cache'
  };

  // 重试机制
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`尝试获取游戏信息，第 ${attempt} 次...`);
      
      const response = await axios.get(
        'https://store.steampowered.com/api/appdetails',
        { 
          params: { appids: input.appid },
          headers,
          timeout: 10000 // 10秒超时
        }
      );

      if (!response.data || !response.data[input.appid] || !response.data[input.appid].success) {
        throw new Error('Failed to fetch Steam game information');
      }

      const gameData = response.data[input.appid].data;
      
      return {
        name: gameData.name,
        detailed_description: gameData.detailed_description
      };
    } catch (error: any) {
      lastError = error;
      console.error(`获取游戏信息失败，尝试 ${attempt}/${maxRetries}:`, error.message);
      
      // 最后一次尝试失败则抛出错误，否则等待后重试
      if (attempt === maxRetries) {
        console.error('所有尝试均失败');
        throw error;
      }
      
      // 等待时间随尝试次数增加
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }

  // 不应该到达这里，但为了类型安全
  throw lastError;
} 