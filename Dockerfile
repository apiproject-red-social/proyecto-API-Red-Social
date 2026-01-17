# ======================================================
# BUILD STAGE
# ======================================================
# Responsible for:
# - installing all dependencies
# - generating Prisma Client
# - building the application
# ======================================================
FROM node:22-alpine AS build

# System deps required by Prisma / native modules
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# ------------------------------------------------------
# Dependencies (cached)
# ------------------------------------------------------
COPY package.json package-lock.json* ./
RUN npm ci

# ------------------------------------------------------
# Source code
# ------------------------------------------------------
COPY . .

# ------------------------------------------------------
# Prisma Client + Build
# ------------------------------------------------------
RUN npx prisma generate
RUN npm run build

# ======================================================
# RUNTIME STAGE
# ======================================================
# Responsible only for running the app
# ======================================================
FROM node:22-alpine AS runtime

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# ------------------------------------------------------
# Copy only what is needed at runtime
# ------------------------------------------------------
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json ./

EXPOSE 3000

# ------------------------------------------------------
# Default command
# (overridden by docker-compose in dev/demo)
# ------------------------------------------------------
CMD ["node", "dist/index.js"]
