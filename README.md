# Microservicio REST - Servicio Técnico

Este proyecto es un backend en Node.js y Express para un microservicio de servicio técnico con conexión a MySQL usando Prisma.

## Entidades mínimas incluidas

- Cliente
- Personal
- Marca
- Modelo
- Equipo
- Orden de Servicio
- Diagnóstico

## Relaciones principales

- Cliente → Órdenes (1:N)
- Marca → Equipos (1:N)
- Modelo → Equipos (1:N)
- Personal → Órdenes (1:N)
- Orden → Diagnósticos (1:N)
- Equipo → Diagnósticos (1:N)

## Estructura del proyecto

- `src/app.js`: configura Express, middlewares y rutas.
- `src/server.js`: inicia el servidor y conecta con Prisma.
- `src/config/prisma.js`: instancia el cliente de Prisma.
- `src/routes/`: define los endpoints REST por entidad.
- `src/controllers/`: implementa la lógica CRUD.
- `src/middlewares/`: middleware de validación y manejo de errores.
- `prisma/schema.prisma`: modelo de datos con MySQL.

## Instalación

```bash
npm install
```

## Configuración

Copia `.env.example` a `.env` y ajusta la conexión a MySQL:

```env
PORT=3000
DATABASE_URL=mysql://root:password@127.0.0.1:3306/servicio_tecnico
NODE_ENV=development
```

## Inicializar Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## Ejecutar en desarrollo

```bash
npm run dev
```

## Endpoints básicos

- `GET /api/clientes`
- `GET /api/clientes/:id`
- `POST /api/clientes`
- `PUT /api/clientes/:id`
- `DELETE /api/clientes/:id`

- `GET /api/personal`
- `GET /api/marcas`
- `GET /api/modelos`
- `GET /api/equipos`
- `GET /api/ordenes_servicio`
- `GET /api/diagnosticos`

## Documentación y pruebas

La API se documenta y prueba con Swagger UI en:

- `http://localhost:3000/api-docs`

## Notas

- La aplicación incluye validación básica con `express-validator`.
- El modelo Prisma usa MySQL y la configuración se controla mediante variables de entorno.
- El esquema completo de la base de datos se puede extender después.
