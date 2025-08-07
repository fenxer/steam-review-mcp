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

## 開發指南
為了確保所有開發者使用一致的工具和版本，我們強烈建議遵循以下指南。

### 環境設定與套件管理器
請務必檢查 package.json 檔案中的 packageManager 欄位，並使用 Corepack 或明確指定的相應套件管理器版本。

#### 初次設定 Corepack (可選):

1. 檢查 Corepack 是否已安裝

    對於 Node.js v18 及更新版本，Corepack 應該是內建的。您可以透過以下指令檢查：

```
npm list -g --depth=0 | grep corepack
```

2. 安裝 Corepack

    如果上述指令沒有顯示 Corepack，您可以透過以下指令全域安裝最新版本的 Corepack：

```
npm install corepack@latest -g
```

如果在此過程中或後續啟用 Corepack 時出現任何錯誤，請嘗試執行上述指令來解決。

3. 啟用 Corepack 對特定套件管理器的管理

    一旦 Corepack 安裝並存在，您需要為專案所使用的套件管理器啟用其自動化管理。例如，如果我們的專案使用 pnpm（請檢查 package.json 中的 packageManager 欄位以確認），請執行：

```
corepack enable pnpm
```

### 開始
1. 安裝依賴
```
pnpm install
```

2. 啟動開發伺服器
```
pnpm dev
```
