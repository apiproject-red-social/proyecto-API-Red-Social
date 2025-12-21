# Usamos una imagen ligera de Node
FROM node:20-alpine

# Instalamos dependencias necesarias para algunas librerías de Node
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código
COPY . .

# Exponemos el puerto de la API
EXPOSE 3000

# El comando por defecto (será sobrescrito por el docker-compose en dev)
CMD ["npm", "run", "dev"]