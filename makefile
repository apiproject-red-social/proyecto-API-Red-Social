C_DEV  := docker compose -f compose.dev.yml
C_DEMO := docker compose -f compose.demo.yml
C_TEST := docker compose -f compose.test.yml

.PHONY: demo test services dev-docker down clean build status

.PHONY: help demo test services dev-docker down clean build status

# Comando por defecto al escribir solo 'make'
.DEFAULT_GOAL := help

help:
	@echo "======================================================================="
	@echo "🔧 API Boilerplate - Comandos de Gestión"
	@echo "======================================================================="
	@echo "Comandos principales:"
	@echo "  make demo         🚀 Levanta el entorno de demostración (producción)"
	@echo "  make test         🧪 Ejecuta la batería de tests y limpia al terminar"
	@echo "  make dev-docker   🐳 Levanta el stack completo para desarrollo"
	@echo "  make services     🐘 Levanta solo la infraestructura (DB/Redis)"
	@echo ""
	@echo "Mantenimiento y Utilidades:"
	@echo "  make status       📊 Muestra el estado de los contenedores y puertos"
	@echo "  make logs-demo    📝 Ver logs de la API en tiempo real (modo demo)"
	@echo "  make down         🛑 Apaga todos los servicios del proyecto"
	@echo "  make clean        🧹 Limpieza profunda (contenedores, redes y volúmenes)"
	@echo "  make build        🏗️ Reconstruye todas las imágenes de Docker"
	@echo "======================================================================="


# Construcción de imágenes
build:
	@$(C_DEV) build
	@$(C_DEMO) build
	@$(C_TEST) build

# --- COMANDOS PRINCIPALES ---

demo:
	@echo "🚀 Iniciando Demo Efímera..."
	@$(C_DEMO) up --build --remove-orphans

test:
	@echo "🧪 Ejecutando Tests Integrados..."
	@$(C_TEST) up --build --abort-on-container-exit --exit-code-from test-api --remove-orphans
	@$(C_TEST) down -v

services:
	@echo "🐘 Levantando infraestructura local (Modo Mixto)..."
	@$(C_DEV) up -d dev-db dev-redis

dev-docker:
	@echo "🐳 Levantando stack de desarrollo completo..."
	@$(C_DEV) up --build

# --- UTILIDADES ---

status:
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Apaga todo eliminando contenedores huérfanos
down:
	@$(C_DEV) down --remove-orphans
	@$(C_DEMO) down --remove-orphans
	@$(C_TEST) down --remove-orphans

# Limpieza profunda (solo de este proyecto)
clean:
	@echo "🧹 Limpiando contenedores, redes y volúmenes del proyecto..."
	# 1. Intento estándar por archivo (ahora en la raíz)
	@$(C_DEV) down -v --rmi local --remove-orphans 2>/dev/null || true
	@$(C_DEMO) down -v --rmi local --remove-orphans 2>/dev/null || true
	@$(C_TEST) down -v --rmi local --remove-orphans 2>/dev/null || true
	
	# 2. Limpieza forzosa por nombres de contenedor (Safe-guard)
	# Esto elimina los contenedores aunque Docker Compose haya perdido el rastro
	@docker rm -f demo-api-1 demo-db-1 demo-redis-1 2>/dev/null || true
	@docker rm -f dev-api-1 dev-db-1 dev-redis-1 2>/dev/null || true
	@docker rm -f test-api-1 test-db-1 test-redis-1 2>/dev/null || true
	
	# 3. Limpieza de redes huérfanas del proyecto
	@docker network prune -f --filter "label=com.docker.compose.project=$(shell basename $(CURDIR))" 2>/dev/null || true
	
	@echo "✨ Proyecto limpio y nombres de contenedores liberados."
	

# Ver logs de la API en demo rápidamente
logs-demo:
	@$(C_DEMO) logs -f api


# Limpieza de TODO en todo docker
clean-docker:
	docker compose -f compose.dev.yml down -v
	docker system prune -f
	@echo "✨ Todo limpio. Imágenes sin usar y caché borradas."

	