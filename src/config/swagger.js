const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AI Business OS API',
    version: '1.0.0',
    description: 'Complete API documentation for AI Business OS',
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
      },
    },
    schemas: {
      ApiSuccess: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
          requestId: { type: 'string', format: 'uuid' },
        },
      },
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' },
          path: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
          requestId: { type: 'string', format: 'uuid' },
        },
      },
      PaginatedResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          data: {
            type: 'object',
            properties: {
              data: { type: 'array' },
              meta: {
                type: 'object',
                properties: {
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                  totalPages: { type: 'integer' },
                  hasNext: { type: 'boolean' },
                  hasPrev: { type: 'boolean' },
                },
              },
            },
          },
          timestamp: { type: 'string' },
          requestId: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['firstName', 'lastName', 'companyName', 'email', 'password'],
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          companyName: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password', minLength: 8 },
        },
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
      ForgotPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      ResetPasswordRequest: {
        type: 'object',
        required: ['email', 'otp', 'newPassword'],
        properties: {
          email: { type: 'string' },
          otp: { type: 'string' },
          newPassword: { type: 'string', format: 'password' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string' },
          newPassword: { type: 'string' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          statusCode: { type: 'integer' },
          error: { type: 'string' },
          message: { type: 'string' },
          path: { type: 'string' },
          timestamp: { type: 'string' },
          requestId: { type: 'string' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          avatar: { type: 'string', nullable: true },
          isActive: { type: 'boolean' },
          role: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Employee: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          employeeCode: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          employmentType: { type: 'string' },
          status: { type: 'string' },
          joiningDate: { type: 'string' },
          department: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          designation: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Lead: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          company: { type: 'string' },
          source: { type: 'string' },
          status: { type: 'string' },
          score: { type: 'integer' },
          owner: { type: 'object', properties: { id: { type: 'string' }, firstName: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          sku: { type: 'string' },
          unit: { type: 'string' },
          type: { type: 'string' },
          costPrice: { type: 'number' },
          sellingPrice: { type: 'number' },
          category: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          invoiceNumber: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          issueDate: { type: 'string' },
          dueDate: { type: 'string' },
          subtotal: { type: 'number' },
          taxAmount: { type: 'number' },
          totalAmount: { type: 'number' },
          balanceDue: { type: 'number' },
          account: { type: 'object', properties: { name: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          code: { type: 'string' },
          status: { type: 'string' },
          priority: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          budget: { type: 'number' },
          completionPercent: { type: 'number' },
          owner: { type: 'object', properties: { firstName: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Ticket: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          ticketNumber: { type: 'string' },
          title: { type: 'string' },
          status: { type: 'string' },
          priority: { type: 'string' },
          category: { type: 'object', properties: { name: { type: 'string' } } },
          reporter: { type: 'object', properties: { firstName: { type: 'string' } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          title: { type: 'string' },
          message: { type: 'string' },
          link: { type: 'string' },
          isRead: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          isSystem: { type: 'boolean' },
          userCount: { type: 'integer' },
          permissions: { type: 'array', items: { type: 'object' } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {},
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
