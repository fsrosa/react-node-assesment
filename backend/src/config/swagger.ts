import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tasks Management API',
      version: '1.0.0',
      description: 'A RESTful API for managing users and tasks',
      contact: {
        name: 'API Support',
        email: 'fabriciosilvarosa@gmail.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The user ID'
            },
            name: {
              type: 'string',
              description: 'The user name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'The user email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The last update date'
            }
          },
          required: ['name', 'email']
        },
        Task: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'The task ID'
            },
            title: {
              type: 'string',
              description: 'The task title'
            },
            description: {
              type: 'string',
              description: 'The task description'
            },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
              description: 'The task status'
            },
            userId: {
              type: 'string',
              description: 'The ID of the user assigned to the task'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The last update date'
            }
          },
          required: ['title', 'description', 'status', 'userId']
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'number',
              description: 'HTTP status code'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'] // Path to the API docs
};

export const specs = swaggerJsdoc(options); 