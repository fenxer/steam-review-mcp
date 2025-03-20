// 获取游戏评测的输入参数
export interface GetGameReviewsInput {
  appid: string | number;
  filter?: 'all' | 'recent' | 'updated';
  language?: string;
  day_range?: number;
  cursor?: string;
  review_type?: 'all' | 'positive' | 'negative';
  purchase_type?: 'all' | 'steam' | 'non_steam_purchase';
  num_per_page?: number;
}

// 游戏评测信息 - 只保留 review 字段
export interface GameReview {
  review: string;
}

// 游戏评测的返回结果
export interface GameReviewsResponse {
  success: number;
  review_score: number;
  review_score_desc: string;
  total_positive: number;
  total_negative: number;
  reviews: GameReview[];
}

// 游戏基本信息的输入参数
export interface GetGameInfoInput {
  appid: string | number;
}

// 游戏基本信息的返回结果
export interface GameInfoResponse {
  name: string;
  detailed_description: string;
}

// MCP 统一返回结果
export interface SteamGameResult {
  game_reviews?: GameReviewsResponse;
  game_info?: GameInfoResponse;
} 