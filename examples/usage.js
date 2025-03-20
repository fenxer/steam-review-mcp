// 示例：如何使用Steam游戏评测MCP

const { getGameReviews, getGameInfo } = require('steam-review-mcp');

// 获取游戏评测示例
async function fetchGameReviews() {
  try {
    // 获取CSGO(AppID: 730)的评测
    const reviews = await getGameReviews({
      appid: '730',
      filter: 'recent',
      language: 'schinese', // 简体中文
      num_per_page: 10 // 只获取10条
    });
    
    console.log('游戏评分:', reviews.review_score_desc);
    console.log('正面评价数:', reviews.total_positive);
    console.log('负面评价数:', reviews.total_negative);
    console.log('首条评测:', reviews.reviews[0].review);
  } catch (error) {
    console.error('获取游戏评测失败:', error);
  }
}

// 获取游戏信息示例
async function fetchGameInfo() {
  try {
    // 获取CSGO(AppID: 730)的基本信息
    const gameInfo = await getGameInfo({
      appid: '730'
    });
    
    console.log('游戏名称:', gameInfo.name);
    console.log('游戏描述:', gameInfo.detailed_description.substring(0, 100) + '...');
  } catch (error) {
    console.error('获取游戏信息失败:', error);
  }
}

// 运行示例
(async () => {
  console.log('--- 获取游戏评测 ---');
  await fetchGameReviews();
  
  console.log('\n--- 获取游戏信息 ---');
  await fetchGameInfo();
})(); 