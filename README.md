# Steam游戏评测 MCP

这是一个MCP（Model Capability Provider）服务，用于获取Steam游戏的评测和基本信息。

## 安装

```bash
npm install steam-review-mcp
```

## 功能

此MCP提供两个主要功能：

1. **获取游戏评测**：从Steam获取特定游戏的评测信息
2. **获取游戏信息**：获取游戏的基本信息，如名称和描述

## 使用方法

### 获取游戏评测

```javascript
const { getGameReviews } = require('steam-review-mcp');

// 获取CSGO的评测
getGameReviews({ 
  appid: '730',  // 必填参数
  filter: 'all', // 可选，默认为'all'
  language: 'schinese', // 可选，默认为'all'
  day_range: 365, // 可选，默认为365
  cursor: '*', // 可选，默认为'*'
  review_type: 'all', // 可选，默认为'all'
  purchase_type: 'all', // 可选，默认为'all'
  num_per_page: 50 // 可选，默认为50
})
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('获取失败:', error);
  });
```

### 获取游戏信息

```javascript
const { getGameInfo } = require('steam-review-mcp');

// 获取CSGO的基本信息
getGameInfo({ appid: '730' })
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('获取失败:', error);
  });
```

## 参数说明

### getGameReviews 参数

| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| appid | string/number | 是 | - | Steam游戏ID |
| filter | string | 否 | 'all' | 筛选条件，可选值：'all'、'recent'、'updated' |
| language | string | 否 | 'all' | 评测语言，如'english'、'schinese'等 |
| day_range | number | 否 | 365 | 筛选最近多少天的评测 |
| cursor | string | 否 | '*' | 分页游标 |
| review_type | string | 否 | 'all' | 评测类型，可选值：'all'、'positive'、'negative' |
| purchase_type | string | 否 | 'all' | 购买类型，可选值：'all'、'steam'、'non_steam_purchase' |
| num_per_page | number | 否 | 50 | 每页返回的评测数量 |

### getGameInfo 参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| appid | string/number | 是 | Steam游戏ID |

## 返回数据结构

### getGameReviews 返回

```javascript
{
  success: 1,
  review_score: 8,
  review_score_desc: "特别好评",
  total_positive: 1234567,
  total_negative: 12345,
  reviews: [
    {
      recommendationid: "123456789",
      author: {
        steamid: "76561198123456789",
        num_games_owned: 100,
        num_reviews: 5,
        playtime_forever: 1000,
        playtime_last_two_weeks: 10,
        playtime_at_review: 800,
        last_played: 1612345678
      },
      language: "schinese",
      review: "这是一个评测内容...",
      timestamp_created: 1612345678,
      timestamp_updated: 1612345678,
      voted_up: true,
      votes_up: 10,
      votes_funny: 2,
      weighted_vote_score: 0.8,
      comment_count: 3,
      steam_purchase: true,
      received_for_free: false,
      written_during_early_access: false
    }
    // 更多评测...
  ]
}
```

### getGameInfo 返回

```javascript
{
  name: "Counter-Strike 2",
  detailed_description: "游戏的详细描述内容..."
}
```

## 许可证

MIT
