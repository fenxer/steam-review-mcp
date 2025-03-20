import axios from 'axios';
import { GetGameInfoInput, GameInfoResponse } from './types';

/**
 * 从Steam获取游戏基本信息
 * @param input 查询参数
 * @returns 游戏基本信息
 */
export async function getGameInfo(input: GetGameInfoInput): Promise<GameInfoResponse> {
  try {
    const response = await axios.get(
      'https://store.steampowered.com/api/appdetails',
      { params: { appids: input.appid } }
    );

    if (!response.data || !response.data[input.appid] || !response.data[input.appid].success) {
      throw new Error('Failed to fetch Steam game information');
    }

    const gameData = response.data[input.appid].data;
    
    return {
      name: gameData.name,
      detailed_description: gameData.detailed_description
    };
  } catch (error) {
    console.error('Error fetching Steam game information:', error);
    throw error;
  }
} 