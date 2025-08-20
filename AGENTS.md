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

## Spec Mode

When a prompt explicitly mentions "spec mode", strictly follow the guidelines and requirements documented in `@.context/SPEC.md`.

**MANDATORY REVIEW PROTOCOL**: Before ANY spec operations, you MUST check `.@context/spec/review/` for pending approvals. If found, IMMEDIATELY stop and demand human reviewer information (Name, Role, Date) before proceeding. NEVER approve reviews using AI credentials.

For detailed specification mode rules and procedures, see:
- **Spec Mode Guidelines**: `@.context/SPEC.md` - Complete specification-driven development workflow

## Code Rules

**IMPORTANT**: When making any changes to the current codebase, strictly follow the requirements specified in `@.context/CODERULES.md`. This includes code standards, type definitions, ESM usage, linting practices, and project organization guidelines.

After each code change, automatically verify that the modifications comply with the code rules. If any violations are detected, immediately adjust the code to meet the standards before proceeding.

## Architecture

For detailed project overview, tech stack, and system architecture, see:
- **Architecture**: `@.context/ARCHITECTURE.md`
