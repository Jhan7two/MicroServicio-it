const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Microservicio Servicio Técnico',
      version: '1.0.0',
      description: 'API REST para gestionar clientes, personal, marcas, modelos, equipos, órdenes de servicio y diagnósticos.',
      contact: {
        name: 'Soporte Técnico',
        email: 'soporte@empresa.com'
      }
    },
    servers: [
      {
        url: 'https://microservicio-it.onrender.com/api',
        description: 'Servidor de Producción (Render)'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desarrollo Local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
