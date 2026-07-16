const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio Servicio Técnico',
      version: '1.0.0',
      description: 'API REST para gestionar clientes, personal, marcas, modelos, equipos, órdenes de servicio y diagnósticos.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
