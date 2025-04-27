# Base image
FROM node:18-alpine AS base

# Install OS dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install dependencies stage
FROM base AS deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN \
  if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm install --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
  else echo "No lockfile found!" && exit 1; \
  fi

# Build stage
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Pass build-time variables
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_API_AUTH_DOMAIN
ARG NEXT_PUBLIC_API_PROJECT_ID
ARG NEXT_PUBLIC_API_APP_ID
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_SOCKET_URL

# Optional: Disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

# Production runner stage
FROM base AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment for production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Build-time args again (for future use, optional here)
ARG NEXT_PUBLIC_API_KEY
ARG NEXT_PUBLIC_API_AUTH_DOMAIN
ARG NEXT_PUBLIC_API_PROJECT_ID
ARG NEXT_PUBLIC_API_APP_ID
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_BASE_SOCKET_URL

# Copy only necessary files from builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]