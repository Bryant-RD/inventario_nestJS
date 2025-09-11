# --- Etapa de Construcción (Builder) ---
# Usamos una imagen de Node.js para instalar dependencias y construir el proyecto
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copiamos los archivos de definición de paquetes e instalamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el script de build para compilar el TypeScript a JavaScript
RUN npm run build

# --- Etapa de Producción ---
# Usamos una imagen ligera de Node.js para la ejecución
FROM node:18-alpine
WORKDIR /usr/src/app

# Copiamos solo los artefactos necesarios desde la etapa de construcción
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Exponemos el puerto en el que correrá la aplicación
EXPOSE 4000

# El comando para iniciar la aplicación
CMD [ "node", "dist/main.js" ]

