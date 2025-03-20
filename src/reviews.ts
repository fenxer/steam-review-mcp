import axios from 'axios';
import { GetGameReviewsInput, GameReviewsResponse } from './types';

/**
 * 从Steam获取游戏评测信息
 * @param input 查询参数
 * @returns 游戏评测信息
 */
export async function getGameReviews(input: GetGameReviewsInput): Promise<GameReviewsResponse> {
  // 设置默认值
  const params = {
    json: 1,
    filter: input.filter || 'all',
    language: input.language || 'all',
    day_range: input.day_range || 365,
    cursor: input.cursor || '*',
    review_type: input.review_type || 'all',
    purchase_type: input.purchase_type || 'all',
    num_per_page: input.num_per_page || 50
  };

  try {
    const response = await axios.get(
      `https://store.steampowered.com/appreviews/${input.appid}`,
      { params }
    );

    if (!response.data || !response.data.success) {
      throw new Error('Failed to fetch Steam game reviews');
    }

    // 提取需要的字段
    const {
      success,
      query_summary: {
        review_score,
        review_score_desc,
        total_positive,
        total_negative
      },
      reviews
    } = response.data;

    return {
      success,
      review_score,
      review_score_desc,
      total_positive,
      total_negative,
      reviews
    };
  } catch (error) {
    console.error('Error fetching Steam game reviews:', error);
    throw error;
  }
} 