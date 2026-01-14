# Documentacion Tecnica

## Arquitectura

El proyecto implementa **Arquitectura Hexagonal (Ports & Adapters)** con principios de clean architecture.

```
src/
├── domain/           # Logica de negocio pura (sin dependencias externas)
├── application/      # Casos de uso y puertos
├── infrastructure/   # Implementaciones concretas (DB, JWT, Rate Limiter)
├── presentation/     # Capa HTTP (controllers, routes, middleware)
└── dependency-injection/  # Contenedor de inyeccion de dependencias
```

### Flujo de Dependencias

```
Presentation -> Application -> Domain
                    ^
Infrastructure ─────┘
```

- **Domain**: Cero dependencias externas
- **Application**: Define interfaces (ports) para servicios externos
- **Infrastructure**: Implementa los ports definidos en Application
- **Presentation**: Orquesta casos de uso

## Modelo de Datos

### User
| Campo     | Tipo      | Descripcion                    |
|-----------|-----------|--------------------------------|
| id        | UUID      | Identificador unico            |
| email     | String    | Email unico del usuario        |
| name      | String    | Nombre del usuario             |
| password  | String    | Hash bcrypt de la contrasena   |
| createdAt | DateTime  | Fecha de creacion              |
| updatedAt | DateTime  | Ultima actualizacion           |
| deletedAt | DateTime? | Soft delete (nullable)         |

### Project
| Campo       | Tipo     | Descripcion                  |
|-------------|----------|------------------------------|
| id          | UUID     | Identificador unico          |
| name        | String   | Nombre del proyecto          |
| description | String?  | Descripcion (opcional)       |
| userId      | UUID     | FK al usuario propietario    |
| createdAt   | DateTime | Fecha de creacion            |
| updatedAt   | DateTime | Ultima actualizacion         |

Relacion: User 1:N Project (cascade delete)

## Autenticacion

Flujo JWT:

1. Usuario envia credenciales a `/api/auth/login`
2. `LoginUseCase` valida credenciales con bcrypt
3. `JWTTokenService` genera token firmado
4. Cliente incluye token en header: `Authorization: Bearer <token>`
5. `AuthMiddleware` valida y decodifica el token
6. Usuario autenticado disponible en `req.user`

## Rate Limiter

Implementacion custom en memoria usando algoritmo de **sliding window**.

### Configuracion
- `RATE_LIMIT_WINDOW_MS`: Ventana de tiempo (default: 900000ms = 15min)
- `RATE_LIMIT_MAX_REQUESTS`: Maximo de requests por ventana (default: 100)

### Funcionamiento
1. Almacena timestamps de requests por identificador (IP/userId)
2. Filtra timestamps fuera de la ventana actual
3. Permite request si `count < maxRequests`
4. Limpieza automatica cada 60 segundos para prevenir memory leaks

### Headers de Respuesta
- `X-RateLimit-Remaining`: Requests restantes
- `X-RateLimit-Reset`: Timestamp de reset
- HTTP 429 cuando se excede el limite

## API Endpoints

### Publicos
| Metodo | Ruta                | Descripcion          |
|--------|---------------------|----------------------|
| POST   | /api/auth/register  | Registro de usuario  |
| POST   | /api/auth/login     | Login (retorna JWT)  |

### Protegidos (requieren JWT)
| Metodo | Ruta              | Descripcion            |
|--------|-------------------|------------------------|
| GET    | /api/users        | Listar usuarios        |
| GET    | /api/users/:id    | Obtener usuario por ID |
| POST   | /api/users        | Crear usuario          |
| PUT    | /api/users/:id    | Actualizar usuario     |
| DELETE | /api/users/:id    | Eliminar usuario       |
| GET    | /api/projects     | Listar proyectos       |
| GET    | /api/projects/:id | Obtener proyecto       |
| POST   | /api/projects     | Crear proyecto         |
| PUT    | /api/projects/:id | Actualizar proyecto    |
| DELETE | /api/projects/:id | Eliminar proyecto      |

## Patrones de Diseno

### Repository Pattern
Interfaces en `domain/repositories/`, implementaciones en `infrastructure/persistence/`.

### Use Case Pattern
Cada operacion de negocio encapsulada en una clase dedicada:
- `CreateUserUseCase`, `LoginUseCase`, `CreateProjectUseCase`, etc.

### Value Objects
Conceptos de dominio modelados con validacion:
- `Email`: Validacion de formato
- `Password`: Requisitos de seguridad
- `UserId`, `ProjectId`: Identificadores tipados

### DTO Pattern
Objetos de transferencia para desacoplar contratos de API del dominio:
- Request DTOs: Validados con Zod
- Response DTOs: Formato de respuesta estandarizado

### Dependency Injection
`Container` singleton que instancia y conecta dependencias:
```typescript
Container.getInstance().getUserController()
```

## Stack Tecnologico

- **Runtime**: Node.js
- **Framework**: Express
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de datos**: PostgreSQL
- **Autenticacion**: JWT (jsonwebtoken)
- **Hashing**: bcrypt
- **Validacion**: Zod
- **Testing**: Jest
