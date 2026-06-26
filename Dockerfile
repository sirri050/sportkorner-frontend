# Stage 1: Install dependencies
FROM oven/bun:alpine AS deps
WORKDIR /app

# Note the change from bun.lockb to bun.lock
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time variables for Next.js 15
ARG NEXT_PUBLIC_STRAPI_URL
ARG STRAPI_API_TOKEN
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL
ENV STRAPI_API_TOKEN=$STRAPI_API_TOKEN

RUN bun run build

# Stage 3: Runner
FROM oven/bun:alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
# Ensure your package.json has a "start" script
CMD ["bun", "run", "start"]