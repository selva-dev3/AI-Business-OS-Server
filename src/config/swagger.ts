import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AI Business OS API',
    version: '1.0.0',
    description: 'Complete API documentation for AI Business OS - An integrated business management platform covering CRM, HRMS, Finance, Inventory, Procurement, Projects, Support, Documents, Analytics, and AI features.',
    contact: { name: 'Support', email: 'support@aibusinessos.com' },
  },
  servers: [
    { url: '/api/v1', description: 'API v1' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {} as Record<string, unknown>,
  },
};

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ['./src/routes/*.js', './src/routes/*.ts'],
});

export default swaggerSpec;
