# backend/Dockerfile
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código
COPY . .

# Copiar archivo de entorno para contenedor
COPY .env.docker .env

# Exponer el puerto del backend
EXPOSE 4000

# Comando para generar Prisma y correr servidor
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && node src/server.js"]
