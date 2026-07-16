# Microservicio REST - Sistema de Servicio Técnico

## Objetivo

Desarrollar un microservicio REST para gestionar las siguientes entidades:

- Cliente
- Personal
- Marca
- Modelo
- Equipo
- Orden de Servicio
- Diagnóstico

## Tecnologías

- **Backend:** Node.js + Express.js
- **Base de datos:** PostgreSQL (Neon o Supabase)
- **ORM:** Prisma
- **Documentación:** Swagger (OpenAPI)
- **Hosting:** Render

---

# Arquitectura

```text
src/
│
├── config/
├── controllers/
├── services/
├── repositories/
├── routes/
├── middlewares/
├── prisma/
│   └── schema.prisma
├── utils/
├── app.js
└── server.js
```

---

# Variables de entorno

```env
PORT=3000
DATABASE_URL=
NODE_ENV=development
JWT_SECRET=
```

---

# Base de Datos

## Cliente

| Campo | Tipo |
|--------|------|
| id_cliente | Int (PK) |
| nombre | Varchar(100) |
| apellido | Varchar(100) |
| nit_ci | Varchar(30) |
| telefono | Varchar(20) |
| correo | Varchar(120) |
| direccion | Varchar(255) |
| fecha_registro | Timestamp |
| estado | TINYINT(1) |

## Personal

| Campo | Tipo |
|--------|------|
| id_personal | Int (PK) |
| nombre | Varchar(100) |
| apellido | Varchar(100) |
| cargo | Varchar(60) |
| telefono | Varchar(20) |
| correo | Varchar(120) |
| especialidad | Varchar(100) |
| fecha_ingreso | Date |
| estado | Boolean |

## Marca

| Campo | Tipo |
|--------|------|
| id_marca | Int (PK) |
| nombre_marca | Varchar(80) |
| pais_origen | Varchar(80) |
| estado | TINYINT(1) |

## Modelo

| Campo | Tipo |
|--------|------|
| id_modelo | BIGINT UNSIGNED (PK) |
| nombre_modelo | Varchar(100) |
| estado | TINYINT(1) |

## Equipo

| Campo | Tipo |
|--------|------|
| id_equipo | BIGINT UNSIGNED (PK) |
| numero_serie | Varchar(100) |
| color | Varchar(50) |
| accesorios | Text |
| estado | TINYINT(1) |
| id_marca | BIGINT UNSIGNED (FK) |
| id_modelo | BIGINT UNSIGNED (FK) |

Estados sugeridos:

- Recibido
- En Diagnóstico
- En Reparación
- Listo para Entrega
- Entregado

## Orden de Servicio

| Campo | Tipo |
|--------|------|
| id_orden | BIGINT UNSIGNED (PK) |
| id_cliente | BIGINT UNSIGNED (FK) |
| id_personal | BIGINT UNSIGNED (FK) |
| fecha_ingreso | DATE |
| fecha_entrega | DATE |
| problema_reportado | TEXT |
| costo | DECIMAL(10,2) |
| estado | ENUM('pendiente','en_proceso','finalizada','Anulado') |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |

Prioridad:

- Baja
- Media
- Alta
- Urgente

Estado:

- Pendiente
- En revisión
- En reparación
- Finalizado
- Entregado
- Cancelado

## Diagnóstico

| Campo | Tipo |
|--------|------|
| id_diagnostico | BIGINT UNSIGNED (PK) |
| id_orden | BIGINT UNSIGNED (FK) |
| id_equipo | BIGINT UNSIGNED (FK) |
| descripcion | TEXT |
| solucion | TEXT |
| fecha | DATE |
| observacion | TEXT |
| estado | ENUM('pendiente','confirmado','reparado') |
| created_at | TIMESTAMP NULL |
| updated_at | TIMESTAMP NULL |

---

# Relaciones

- Cliente → Órdenes (1:N)
- Marca → Equipos (1:N)
- Modelo → Equipos (1:N)
- Personal → Órdenes (1:N)
- Orden → Diagnósticos (1:N)
- Equipo → Diagnósticos (1:N)

---

# Módulos

- Clientes
- Personal
- Marcas
- Modelos
- Equipos
- Órdenes de Servicio
- Diagnósticos

Cada módulo implementará:

- Crear
- Listar
- Buscar por ID
- Actualizar
- Eliminar

---

# Endpoints

## Clientes

```
GET    /clientes
GET    /clientes/:id
POST   /clientes
PUT    /clientes/:id
DELETE /clientes/:id
```

## Personal

```
GET    /personal
GET    /personal/:id
POST   /personal
PUT    /personal/:id
DELETE /personal/:id
```

## Marcas

```
GET    /marcas
GET    /marcas/:id
POST   /marcas
PUT    /marcas/:id
DELETE /marcas/:id
```

## Modelos

```
GET    /modelos
GET    /modelos/:id
GET    /marcas/:id/modelos
POST   /modelos
PUT    /modelos/:id
DELETE /modelos/:id
```

## Equipos

```
GET    /equipos
GET    /equipos/:id
POST   /equipos
PUT    /equipos/:id
DELETE /equipos/:id
```

## Órdenes de Servicio

```
GET    /ordenes_servicio
GET    /ordenes_servicio/:id
POST   /ordenes_servicio
PUT    /ordenes_servicio/:id
DELETE /ordenes_servicio/:id
```

## Diagnósticos

```
GET    /diagnosticos
GET    /diagnosticos/:id
GET    /ordenes_servicio/:id/diagnosticos
POST   /diagnosticos
PUT    /diagnosticos/:id
DELETE /diagnosticos/:id
```

## Documentación y pruebas

La API puede documentarse y probarse con Swagger UI en:

- `http://localhost:3000/api-docs`

---

# Validaciones

- Todos los campos obligatorios deben validarse.
- Verificar existencia de claves foráneas.
- Número de serie único.
- Correo con formato válido.
- Estado y prioridad mediante valores permitidos.
- Manejo global de errores.

---

# Respuestas HTTP

| Código | Descripción |
|---------|-------------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|404|Not Found|
|500|Internal Server Error|

---

# Librerías

- express
- prisma
- @prisma/client
- dotenv
- cors
- helmet
- morgan
- express-validator
- swagger-ui-express
- swagger-jsdoc
- jsonwebtoken
- bcrypt
- nodemon

---

# Buenas prácticas

- Arquitectura por capas.
- Controllers sin lógica de negocio.
- Services con lógica de negocio.
- Repositories usando Prisma.
- Variables de entorno.
- Código modular.
- Uso de async/await.
- Middleware de manejo de errores.
- API documentada con Swagger.

---

# Despliegue

- Base de datos: Neon o Supabase.
- Backend: Render.
- Variables de entorno configuradas en Render.
- Documentación accesible desde `/api-docs`.

---

# Objetivo Final

Construir un microservicio REST profesional que implemente CRUD para todas las entidades, siga buenas prácticas, utilice Prisma con PostgreSQL y pueda desplegarse gratuitamente en Render.
