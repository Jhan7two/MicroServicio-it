CREATE DATABASE IF NOT EXISTS sistema_ti;
USE sistema_ti;

-- 1. Tabla: personal
CREATE TABLE personal (
    id_personal BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cargo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    correo VARCHAR(255) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_personal),
    UNIQUE KEY uk_personal_correo (correo)
);

-- 2. Tabla: marcas_equipo
CREATE TABLE marcas_equipo (
    id_marca BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_marca VARCHAR(100) NOT NULL,
    pais_origen VARCHAR(100) DEFAULT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_marca)
);

-- 3. Tabla: modelos
CREATE TABLE modelos (
    id_modelo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre_modelo VARCHAR(100) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_modelo)
);

-- 4. Tabla: equipos
CREATE TABLE equipos (
    id_equipo BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    numero_serie VARCHAR(100) NOT NULL,
    color VARCHAR(50) DEFAULT NULL,
    accesorios TEXT DEFAULT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    id_marca BIGINT UNSIGNED NOT NULL,
    id_modelo BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_equipo),
    UNIQUE KEY uk_equipos_numero_serie (numero_serie),
    FOREIGN KEY (id_marca) REFERENCES marcas_equipo(id_marca),
    FOREIGN KEY (id_modelo) REFERENCES modelos(id_modelo)
);

-- 5. Tabla: clientes
CREATE TABLE clientes (
    id_cliente BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    telefono VARCHAR(20) DEFAULT NULL,
    correo VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) DEFAULT NULL,
    nit_ci VARCHAR(30) NOT NULL,
    estado TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_cliente),
    UNIQUE KEY uk_clientes_correo (correo),
    UNIQUE KEY uk_clientes_nit_ci (nit_ci)
);

-- 6. Tabla: orden_servicio
CREATE TABLE orden_servicio (
    id_orden BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    fecha_ingreso DATE NOT NULL,
    fecha_entrega DATE DEFAULT NULL,
    problema_reportado TEXT NOT NULL,
    costo DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('pendiente', 'en_proceso', 'finalizada', 'Anulado') NOT NULL DEFAULT 'pendiente',
    id_cliente BIGINT UNSIGNED NOT NULL,
    id_personal BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_orden),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_personal) REFERENCES personal(id_personal)
);

-- 7. Tabla: diagnosticos
CREATE TABLE diagnosticos (
    id_diagnostico BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    id_orden BIGINT UNSIGNED NOT NULL,
    id_equipo BIGINT UNSIGNED NOT NULL,
    descripcion TEXT NOT NULL,
    solucion TEXT DEFAULT NULL,
    fecha DATE NOT NULL,
    observacion TEXT DEFAULT NULL,
    estado ENUM('pendiente','confirmado','reparado') NOT NULL DEFAULT 'pendiente',
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,

    PRIMARY KEY (id_diagnostico),
    FOREIGN KEY (id_orden) REFERENCES orden_servicio(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_equipo) REFERENCES equipos(id_equipo)
);
