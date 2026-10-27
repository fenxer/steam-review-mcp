# Steam Review MCP

[English](./README.md) | **中文**

使用 Model Context Protocol (MCP) 获取 Steam 游戏评测。

[![MCP Badge](https://lobehub.com/badge/mcp/fenxer-steam-review-mcp)](https://lobehub.com/mcp/fenxer-steam-review-mcp)

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-light.svg)](https://cursor.com/install-mcp?name=steam-review-mcp&config=eyJjb21tYW5kIjoibnB4IHN0ZWFtLXJldmlldy1tY3AifQ%3D%3D)

<a href="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@fenxer/steam-review-mcp/badge" />
</a>

## 功能

帮助 LLM 获取 Steam 游戏的评测和游戏信息：

- 获取一页游戏评测（分数、总数、清洗后的评测正文，以及下一页 cursor）
- 从 `IStoreBrowseService/GetItems` 获取商店名称和完整简介
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
    "steam-review-mcp": {
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

这个 MCP 服务提供了 `get_steam_review` 工具。传入 Steam app id 后，它会读取：

- [IUserReviewsService/GetAppReviews](https://partner.steamgames.com/doc/webapi/IUserReviewsService)
- [IStoreBrowseService/GetItems](https://steamapi.xpaw.me/IStoreBrowseService)

`store.steampowered.com/appreviews` 已于 2026-10-22 停用。参数仍使用原来的字符串（`all`、`recent`、`steam`），由服务端映射进 `input_json`。

工具同时返回文本 JSON 和相同的 `structuredContent`：

1. `game_reviews`：
   - `success`：Steam 返回了 `response` 对象时为 `true`
   - `review_score`：评测分数；这一页没有分数时为 `null`
   - `review_score_desc`：评测分数描述
   - `total_positive`：正面评测总数
   - `total_negative`：负面评测总数
   - `total_reviews`：正面与负面合计
   - `total_matching`：符合筛选条件的评测数
   - `day_range_used`：Helpful 筛选实际搜索的天数
   - `cursor`：取下一页时原样传回
   - `reviews`：这一页清洗后的评测正文

2. `game_info`：
   - `name`：商店名称
   - `detailed_description`：去掉 BBCode 后的商店简介

Steam 的 `response` 为空表示没有匹配评测。此时汇总字段为 `null`，`reviews` 为空数组。只有需要更高频率限制时才设置 `STEAM_WEB_API_KEY`，公开接口不带 key 也能调用。

### Code mode

本服务保持为 SDK v1 的 stdio 上游，可被 Cloudflare 的单工具 code mode 包裹。`get_steam_review` 公布了输出 schema、只读注解和 `structuredContent`。宿主可以用 `codeMcpServer()` 包装它。这个包本身不把工具换成一个 `code` 工具，因为那一层属于宿主，而且当前 code mode 仍通过旧的 SDK v1 handler 提供服务。

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