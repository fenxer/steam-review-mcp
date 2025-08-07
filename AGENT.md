# Steam Review MCP

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Model Context Protocol (MCP) server that provides Steam game review retrieval capabilities. The server exposes tools for fetching Steam reviews and game information, with built-in prompts for analysis.

## Essential Commands

- **Build**: `pnpm run build`
- **Type Check**: `pnpm tsc --noEmit`
- **Test**: `pnpm test`
- **Development**: `pnpm dev`
- **Start**: `pnpm start`
- **Lint**: `pnpm lint`
- **Lint Fix**: `pnpm lint:fix`

## Testing

- Vitest for unit testing
- Tests located alongside source files (`.spec.ts` suffix)

## Architecture & Code Standards

For detailed information, see:
- **Architecture**: `.context/ARCHITECTURE.md` - Project overview, tech stack, and system architecture
- **Code Rules**: `.context/CODERULES.md` - Code standards and linting guidelines
