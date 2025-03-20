# Steam Review MCP

使用 Model Context Protocol (MCP) 的 Steam 游戏评测查询服务。

## 功能

这个 MCP 服务可以帮助 AI 模型获取 Steam 游戏的评测和游戏信息：

- 获取游戏评测（正面/负面评价数量、评测分数、评测内容等）
- 获取游戏基本信息（名称、详细描述）

## 安装

```bash
npm install steam-review-mcp
```

## 使用方法

这个 MCP 服务提供了 `get_steam_review` 工具，可以通过传入 Steam 游戏的 appid 来获取评测和游戏信息。

### 参数

- `appid`（必需）：Steam 游戏的 ID，例如 `570`（Dota 2）
- `filter`（可选，默认 "all"）：过滤类型
- `language`（可选，默认 "all"）：语言过滤
- `day_range`（可选，默认 365）：评测天数范围
- `cursor`（可选，默认 "*"）：游标
- `review_type`（可选，默认 "all"）：评测类型
- `purchase_type`（可选，默认 "all"）：购买类型
- `num_per_page`（可选，默认 50）：每页结果数量

### 返回数据

返回的数据包含两部分：

1. `game_reviews`：
   - `success`：查询是否成功
   - `review_score`：评测分数
   - `review_score_desc`：评测分数描述
   - `total_positive`：正面评测总数
   - `total_negative`：负面评测总数
   - `reviews`：评测内容列表

2. `game_info`：
   - `name`：游戏名称
   - `detailed_description`：游戏详细描述

## 开发

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 运行服务
npm start
```
