# ======================================================
# Base image
# ======================================================
# Node 22, Alpine-based, stable and lightweight
FROM node:22-alpine

# ======================================================
# System dependencies
# ======================================================
# libc6-compat is required by some native Node/Prisma deps
RUN apk add --no-cache libc6-compat openssl

# ======================================================
# App directory
# ======================================================
WORKDIR /app

# ======================================================
# Dependency installation (cached)
# ======================================================
# Copy only dependency manifests first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies)
RUN npm install

# ======================================================
# Copy application source
# ======================================================
COPY . .

# ======================================================
# Prisma
# ======================================================
# Generate Prisma Client during build to avoid runtime surprises
# Safe with Prisma 6
RUN npx prisma generate

# ======================================================
# App port
# ======================================================
EXPOSE 3000

# ======================================================
# Default command (overridden in compose.override.yml)
# ======================================================
CMD ["npm", "run", "dev"]
