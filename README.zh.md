# Steam Review MCP

[English](./README.md) | **中文**

使用 Model Context Protocol (MCP) 获取 Steam 游戏评测。

## 功能

帮助 LLM 获取 Steam 游戏的评测和游戏信息：

- 获取游戏评测（正面/负面评价数量、评测分数、评测内容等）
- 获取游戏基本信息（名称、详细描述）
- 分析游戏评测，总结游戏的优缺点

## 安装

直接使用 npx 运行：

```bash
npx steam-review-mcp
```

或自行添加：

```json
{
  "mcpServers": {
    "github.com/fenxer/steam-review-mcp": {
      "command": "npx",
      "args": [
        "steam-review-mcp"
      ]
    }
  }
}
```

## 使用方法

### 工具 (Tools)

这个 MCP 服务提供了 `get_steam_review` 工具，可以通过传入 Steam 游戏的 appid 来获取评测和游戏信息。

详细可查看 Steamwork API: [User Reviews - Get List](https://partner.steamgames.com/doc/store/getreviews)

返回的数据包含两部分：

1. `game_reviews`：
   - `success`：查询是否成功
   - `review_score`：评测分数
   - `review_score_desc`：评测分数描述
   - `total_positive`：正面评测总数
   - `total_negative`：负面评测总数
   - `reviews`：所有评测的文本内容（不包含其他元数据）

2. `game_info`：
   - `name`：游戏名称
   - `detailed_description`：游戏详细描述

### 提示模板 (Prompts)

#### summarize-reviews

用于游戏的整体分析游戏评测，总结游戏的优缺点。

##### 参数

- `appid`（必需）：Steam 游戏的 ID，例如 `570`（Dota 2）


#### recent-reviews-analysis

用于分析游戏的最近评测，总结游戏的当前状态和玩家反馈。

##### 参数

- `appid`（必需）：Steam 游戏的 ID，例如 `570`（Dota 2）


## 开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行服务
npm start
``` 