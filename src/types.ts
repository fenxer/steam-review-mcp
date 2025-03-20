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

// 游戏评测信息
export interface GameReview {
  recommendationid: string;
  author: {
    steamid: string;
    num_games_owned: number;
    num_reviews: number;
    playtime_forever: number;
    playtime_last_two_weeks: number;
    playtime_at_review: number;
    last_played: number;
  };
  language: string;
  review: string;
  timestamp_created: number;
  timestamp_updated: number;
  voted_up: boolean;
  votes_up: number;
  votes_funny: number;
  weighted_vote_score: number;
  comment_count: number;
  steam_purchase: boolean;
  received_for_free: boolean;
  written_during_early_access: boolean;
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