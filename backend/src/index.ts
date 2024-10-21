import express from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes';
import { connectDB } from './config/db';

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'My API', // Title of the API
      version: '1.0.0', // Version of the API
      description: 'API documentation for my application',
      contact: {
        name: 'Nirav', // Your name
        email: 'niravp@mindfiresolutions.com', // Your email
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use the imported routes
app.use(router);

connectDB(PORT, app);

export default app;
