FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g corepack@latest && corepack enable pnpm
COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
WORKDIR /app
RUN pnpm install --prod --frozen-lockfile

FROM base AS build
WORKDIR /app
RUN pnpm install --frozen-lockfile
COPY index.js tsconfig.json build.config.ts ./
COPY src ./src
RUN pnpm run build

FROM base
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
CMD ["pnpm", "start"]


