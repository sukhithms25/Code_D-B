const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Code-D-B API Documentation',
      version: '1.0.0',
      description: 'API documentation for the AI-Based Student Performance Analysis System Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Automatically generate documentation from route comments
};

const specs = swaggerJsDoc(options);

const swaggerSetup = (app) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = swaggerSetup;
