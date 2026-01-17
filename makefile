C_DEV  := docker compose -f compose/compose.dev.yml
C_DEMO := docker compose -f compose/compose.demo.yml
C_TEST := docker compose -f compose/compose.test.yml

.PHONY: demo test services dev-docker down clean build status

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

# Limpieza profunda pero segura (solo de este proyecto)
clean:
	@echo "🧹 Limpiando contenedores, redes y volúmenes del proyecto..."
	@$(C_DEV) down -v --rmi local --remove-orphans
	@$(C_DEMO) down -v --rmi local --remove-orphans
	@$(C_TEST) down -v --rmi local --remove-orphans
	@echo "✨ Proyecto limpio."

# Ver logs de la API en demo rápidamente
logs-demo:
	@$(C_DEMO) logs -f api


# Limpieza de TODO en todo docker
clean-docker:
	docker compose -f compose/compose.dev.yml down -v
	docker system prune -f
	@echo "✨ Todo limpio. Imágenes sin usar y caché borradas."