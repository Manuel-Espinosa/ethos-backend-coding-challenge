# Ethos Backend - Guía de Configuración y Uso

Esta guía te ayudará a configurar, levantar y probar la aplicación
backend.

## Configuración Inicial

### 1. Clonar el repositorio e instalar dependencias

``` bash
cd ethos-backend-coding-challenge

npm install
```

### 2. Configurar variables de entorno

El archivo `.env` ya está configurado con valores por defecto. Verifica
que tenga:

``` env
DOCKER_DB_PORT=5432
DOCKER_APP_PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ethos?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PORT=3000
```

Importante: En producción, cambia el `JWT_SECRET` por un valor seguro.

### 3. Levantar servicios

``` bash
docker compose up -d

docker ps
```

### 4. Ejecutar migraciones de Prisma

``` bas
docker compose exec backend npx prisma migrate dev
docker compose exec backend npx prisma generate
```

El servidor estará disponible en http://localhost:3000
