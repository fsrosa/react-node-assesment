import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { createServer } from 'http';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler } from './middleware/errorHandler';
import { specs } from './config/swagger';
import { eventService } from './services/EventService';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const port = process.env.PORT || 3000;

// Initialize EventService
eventService.initialize(httpServer);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to the Tasks Management API',
    documentation: '/api-docs'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
httpServer.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`📚[swagger]: API documentation available at http://localhost:${port}/api-docs`);
  console.log(`🔌[websocket]: WebSocket server is ready for real-time updates`);
});

export default app; 