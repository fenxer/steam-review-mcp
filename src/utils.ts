import type { McpServer, PromptCallback, ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type { ZodOptional, ZodRawShape, ZodType, ZodTypeDef } from 'zod'
import { decode } from 'entities'
import { ofetch } from 'ofetch'
import striptags from 'striptags'
import { z } from 'zod'
import { STEAM_BASEURL, USER_AGENT } from './consts'

type PromptArgsRawShape = {
  [k: string]: ZodType<string, ZodTypeDef, string> | ZodOptional<ZodType<string, ZodTypeDef, string>>
}

const registerType = z.enum(['registerTool', 'resource', 'prompt'])

export function pipe(input: unknown, ...funcsOrValues: ((...args: any[]) => any)[]): any {
  return funcsOrValues.reduce((acc, fn) => fn(acc), input)
}

// Helper function to clean and format review text for JSON
export function sanitizeHTMLText(text: string): string {
  if (!text)
    return ''

  return pipe(
    text,
    decode,
    striptags,
    (s: string) => s.replace(/\r\n|\n|\r/g, '\\n'),
    (s: string) => s.replace(/["']/g, ''),
    (s: string) => s.replace(/\s+/g, ' '),
    (s: string) => s.trim(),
  ) as string
}

// Helper function to handle any request to the Steam API
export const steamFetch = ofetch.create({
  baseURL: STEAM_BASEURL,
  headers: { 'User-Agent': USER_AGENT },
})

// Helper function to define a mcp tool
export function defineTool<
  InputSchema extends ReturnType<typeof z.object<ZodRawShape>>,
  OutputSchema extends ReturnType<typeof z.object<ZodRawShape>>,
>(args: {
  name: string
  cb: ToolCallback<InputSchema['shape']>
  description?: string
  inputSchema?: InputSchema
  outputSchema?: OutputSchema
  annotations?: ToolAnnotations
}): {
  type: typeof registerType.enum.registerTool
  options: Parameters<McpServer['registerTool']>
} {
  return {
    type: registerType.enum.registerTool,
    options: [
      args.name,
      {
        description: args.description,
        inputSchema: args.inputSchema?.shape,
        outputSchema: args.outputSchema?.shape,
        annotations: args.annotations,
      },
      async (...params) => {
        try {
          return await args.cb(...params)
        }
        catch (error: unknown) {
          console.error(error)
          throw error
        }
      },
    ] as const,
  }
}

// Helper function to define a mcp prompt
export function definePrompt<ArgsSchema extends ReturnType<typeof z.object<PromptArgsRawShape>> | undefined>(args: {
  name: string
  description?: string
  argsSchema?: ArgsSchema
  cb: PromptCallback<ArgsSchema extends ZodType ? ArgsSchema['shape'] : ArgsSchema>
}): {
  type: typeof registerType.enum.prompt
  options: Parameters<McpServer['prompt']>
} {
  return {
    type: registerType.enum.prompt,
    options: [args.name, args.description, args.argsSchema?.shape, args.cb].filter(v => v) as Parameters<McpServer['prompt']>,
  }
}
