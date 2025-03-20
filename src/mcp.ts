import mcpDefinition from './mcp.json';
import { getGameReviews } from './reviews';
import { getGameInfo } from './game-info';
import { SteamGameResult } from './types';

export { mcpDefinition };

/**
 * MCP处理函数，根据请求类型调用相应的处理函数
 * @param name 函数名称
 * @param args 函数参数
 * @returns 处理结果
 */
export async function mcpHandler(name: string, args: any): Promise<SteamGameResult> {
  const result: SteamGameResult = {};

  switch (name) {
    case 'getGameReviews':
      result.game_reviews = await getGameReviews(args);
      break;
    case 'getGameInfo':
      result.game_info = await getGameInfo(args);
      break;
    default:
      throw new Error(`未知的函数名称: ${name}`);
  }

  return result;
} 