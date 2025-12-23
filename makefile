# ======================================================
# Project configuration
# ======================================================
PROJECT_NAME := microblog
COMPOSE := docker compose

# Default env files (can be overridden per target)
ENV_DEV := .env.development
ENV_TEST := .env.test

# ======================================================
# Helpers
# ======================================================
.PHONY: help
help:
	@echo ""
	@echo "Available commands:"
	@echo "  make dev               Run app locally (no Docker)"
	@echo "  make dev-docker        Run app with Docker (dev + hot reload)"
	@echo "  make up                Start Docker services (dev)"
	@echo "  make down              Stop Docker services (dev)"
	@echo "  make rebuild           Rebuild Docker images"
	@echo "  make logs              Follow API logs (dev)"
	@echo ""
	@echo "  make prisma-generate   Generate Prisma client"
	@echo "  make prisma-migrate    Run Prisma migrations (dev)"
	@echo "  make prisma-reset      Reset TEST database"
	@echo ""
	@echo "  make test              Run tests locally"
	@echo "  make test-docker       Run tests inside Docker"
	@echo ""

# ======================================================
# Local development (no Docker)
# ======================================================
.PHONY: dev
dev:
	@echo "▶ Running app locally (NODE_ENV=development)"
	@NODE_ENV=development npm run dev

# ======================================================
# Docker: development
# ======================================================
.PHONY: up
up:
	@echo "▶ Starting Docker services (dev)"
	@$(COMPOSE) up -d

.PHONY: down
down:
	@echo "▶ Stopping Docker services (dev)"
	@$(COMPOSE) down

.PHONY: rebuild
rebuild:
	@echo "▶ Rebuilding Docker images"
	@$(COMPOSE) build --no-cache

.PHONY: dev-docker
dev-docker:
	@echo "▶ Running app with Docker (dev + hot reload)"
	@$(COMPOSE) up --build

.PHONY: logs
logs:
	@echo "▶ Following API logs"
	@$(COMPOSE) logs -f api

# ======================================================
# Prisma (Dentro de Docker)
# ======================================================
.PHONY: prisma-generate
prisma-generate:
	@echo "▶ Generating Prisma client inside Docker"
	@$(COMPOSE) exec api npx prisma generate

.PHONY: db-push
db-push:
	@echo "▶ Sincronizando esquema en Docker (dev)"
	@$(COMPOSE) exec api npm run db:push

.PHONY: prisma-migrate
prisma-migrate:
	@echo "▶ Running Prisma migrations inside Docker"
	@$(COMPOSE) exec api npx prisma migrate dev --name init

.PHONY: prisma-reset
prisma-reset:
	@echo "⚠ Resetting TEST database (using test-docker flow)"
	@$(COMPOSE) -f compose.test.yml up --build --abort-on-container-exit

# ======================================================
# Tests
# ======================================================
.PHONY: test
test:
	@echo "▶ Running tests locally"
	@NODE_ENV=test npm test

.PHONY: test-docker
test-docker:
	@echo "▶ Running tests in isolated Docker environment"
	@$(COMPOSE) -f compose.test.yml up --build --abort-on-container-exit

.PHONY: test-down
test-down:
	@echo "▶ Stopping test Docker containers"
	@$(COMPOSE) -f compose.test.yml down
