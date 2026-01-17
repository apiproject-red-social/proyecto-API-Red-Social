#!/bin/bash
set -e

echo "-------------------------------------------------------"
echo "🛠️  INICIALIZANDO ENTORNO DEMO"
echo "-------------------------------------------------------"

# 1. Espera activa a PostgreSQL
echo "🔍 [1/4] Esperando a la base de datos (demo-db)..."
until pg_isready -h demo-db -p 5432 -U postgres; do
  echo "Postgres no está listo, reintentando en 1s..."
  sleep 1
done

# 2. Espera activa a Redis (demo-redis)
echo "🔍 [2/4] Esperando a Redis (demo-redis)..."
until redis-cli -h demo-redis ping | grep -q "PONG"; do
  echo "Redis no está listo, reintentando en 1s..."
  sleep 1
done

echo "🏗️  [3/4] Sincronizando esquema Prisma..."
npx prisma db push --skip-generate

echo "🌱 [4/4] Cargando datos de prueba (seeding)..."
node prisma/seed.js

echo "🚀 ARRANCANDO SERVIDOR..."
echo "-------------------------------------------------------"
exec node dist/server.js