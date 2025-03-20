import axios from 'axios';
import { GetGameReviewsInput, GameReviewsResponse, GameReview } from './types';

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

  // 设置请求头，模拟浏览器行为
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': `https://store.steampowered.com/app/${input.appid}`,
    'Cache-Control': 'no-cache'
  };

  // 重试机制
  const maxRetries = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`尝试获取游戏评测，第 ${attempt} 次...`);
      
      const response = await axios.get(
        `https://store.steampowered.com/appreviews/${input.appid}`,
        { 
          params,
          headers,
          timeout: 10000 // 10秒超时
        }
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

      // 只提取每个评测的文本内容，不包含完整的评测数组
      const reviewTexts = reviews.map((review: any) => ({
        review: review.review
      }));

      return {
        success,
        review_score,
        review_score_desc,
        total_positive,
        total_negative,
        reviews: reviewTexts
      };
    } catch (error: any) {
      lastError = error;
      console.error(`获取游戏评测失败，尝试 ${attempt}/${maxRetries}:`, error.message);
      
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