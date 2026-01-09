# Ethos PBS - Reto Técnico: Panel Administrativo

## 🎯 Objetivo
Construir un MVP de un panel administrativo aplicando mejores prácticas de desarrollo y una arquitectura limpia.

## 🚀 Stack Tecnológico & Opciones

**Backend (Elige uno):**
- Opción A: Node.js con Elysia (Recomendado)
- Opción B: Python con FastAPI
- **Requisito No Negociable:** Arquitectura Hexagonal (Ports & Adapters).

**Base de Datos (Elige uno):**
- Opción A: Supabase (PostgreSQL) (Recomendado)
- Opción B: MongoDB Local

## 📋 Alcance del Entregable (MVP)

1.  **Backend con Arquitectura Hexagonal:**
    - Debe tener al menos dos entidades claras (ej. User y Project)
    - Debe exponer un endpoint para autenticación
    - Debe exponer endpoints de la API para el CRUD, por ejemplo, GET /api/users y GET /api/projects
    - La lógica de negocio debe estar en el "dominio"
2.  **Conexión a Base de Datos:** La app debe estar conectada a la base de datos elegida, con al menos una tabla/colección creada y un ejemplo de lectura/escritura real

## ⚙️ Proceso de Desarrollo y Entrega

1.  **Fork** este repositorio
2.  **Desarrolla por Módulos:** Utiliza una estrategia de branches para organizar tu trabajo (ej. feat/login, feat/projects-table)
3.  **Pull Requests (PRs):** Abre Pull Requests en tu propio fork para integrar las features a tu rama principal. Esto nos permitirá evaluar tu proceso de desarrollo y forma de organizar el trabajo
4.  **Plazo de Entrega:** **Miércoles a las 18:00 hrs** (5 días naturales a partir de hoy). Al finalizar, asegúrate de que el código final esté en la rama main de tu fork y compártenos el link

## 📊 Criterios de Evaluación

| Categoría | Descripción |
|-----------|-------------|
| **Cumplimiento Funcional** | El proyecto cumple con todas las funcionalidades listadas en el alcance |
| **Arquitectura y Código Limpio** | Implementación correcta de la Arquitectura Hexagonal. Código bien estructurado, legible y con separación de responsabilidades |
| **Proceso de Desarrollo (Git)** | Uso de branches, commits atomicos y descriptivos y Pull Requests bien documentados. Entre más modularizado el desarrollo, mejor evaluación |
| **Stack Tecnológico (Bonus)** | Uso de Supabase y Elysia será considerado como valor agregado |
| **Extra Points** | Funcionalidad extra, documentación excepcional, tests, etc. |


---
Te deseamos el mejor éxito en este reto.