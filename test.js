// 测试脚本
const { getGameReviews, getGameInfo } = require('./dist');
const fs = require('fs');
const path = require('path');

// 测试游戏 ID (CSGO)
const appid = '730';

// 确保输出目录存在
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// 保存响应到JSON文件
function saveResponseToFile(data, filename) {
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`数据已保存到: ${filePath}`);
}

// 创建并返回 SteamGameResult 结构的结果
async function getSteamGameResult(appid) {
  const result = {};
  
  try {
    // 获取游戏评测
    console.log('尝试获取游戏评测...');
    const gameReviews = await getGameReviews({
      appid,
      num_per_page: 3 // 只获取 3 条评测减少输出内容
    });
    
    result.game_reviews = gameReviews;
    console.log('游戏评测获取成功');
  } catch (error) {
    console.error('获取游戏评测失败:', error.message);
    // 继续执行，仅记录错误
  }
  
  try {
    // 获取游戏信息
    console.log('尝试获取游戏信息...');
    const gameInfo = await getGameInfo({ appid });
    
    result.game_info = gameInfo;
    console.log('游戏信息获取成功');
  } catch (error) {
    console.error('获取游戏信息失败:', error.message);
    // 继续执行，仅记录错误
  }
  
  // 如果两个数据都没获取到，则抛出错误
  if (!result.game_reviews && !result.game_info) {
    throw new Error('无法获取任何游戏数据');
  }
  
  return result;
}

// 运行测试
async function runTest() {
  console.log('开始测试 Steam 游戏评测 MCP 服务...\n');
  
  try {
    // 获取 SteamGameResult 结构的结果
    const steamGameResult = await getSteamGameResult(appid);
    
    // 打印摘要信息
    if (steamGameResult.game_reviews) {
      console.log('\n===== 游戏评测信息 =====');
      console.log('评测分数:', steamGameResult.game_reviews.review_score_desc);
      console.log('正面评价数:', steamGameResult.game_reviews.total_positive);
      console.log('负面评价数:', steamGameResult.game_reviews.total_negative);
      
      // 打印每条评测内容
      if (steamGameResult.game_reviews.reviews && steamGameResult.game_reviews.reviews.length > 0) {
        console.log('\n评测样例:');
        steamGameResult.game_reviews.reviews.forEach((review, index) => {
          const previewText = review.review.length > 100 
            ? review.review.substring(0, 100) + '...' 
            : review.review;
          console.log(`[${index + 1}] ${previewText}`);
        });
      }
    }
    
    if (steamGameResult.game_info) {
      console.log('\n===== 游戏基本信息 =====');
      console.log('游戏名称:', steamGameResult.game_info.name);
      console.log('游戏描述:', steamGameResult.game_info.detailed_description.substring(0, 100) + '...');
    }
    
    // 保存 SteamGameResult 结构到文件
    saveResponseToFile(steamGameResult, `steam_game_result_${appid}.json`);
    
    console.log('\n🎉 测试完成! SteamGameResult 数据已保存到文件');
    return true;
  } catch (error) {
    console.error('\n⚠️ 测试失败:', error.message);
    return false;
  }
}

// 执行测试
runTest(); 