import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import packageInfo from '../package.json'
import * as mcpBlocks from './building-block'

const server = new McpServer({
  name: 'steam-review-mcp',
  version: packageInfo.version,
})

for (const block of Object.values(mcpBlocks)) {
  switch (block.type) {
    case 'tool':
      server.registerTool(...block.options)
      break
    case 'prompt':
      server.registerPrompt(...block.options)
      break
  }
}

const transport = new StdioServerTransport()
server.connect(transport).catch(console.error)
