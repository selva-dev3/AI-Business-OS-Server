import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import env from './config/env';
import logger from './config/logger';
import connectDB from './config/db';
import swaggerSpec from './config/swagger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// ================================
// Ensure upload directories exist
// ================================

const uploadDirs = [
  'avatars',
  'logos',
  'documents',
  'receipts',
  'csv',
  'resumes',
];

uploadDirs.forEach((dir: string) => {
  const fullPath = path.join(env.upload.dir, dir);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// ================================
// Security
// ================================

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin',
    },
  })
);

// ================================
// CORS
// ================================

const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

if (env.cors.origin && env.cors.origin !== '*') {
  allowedOrigins.push(env.cors.origin);
}

app.use(
  cors({
    origin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked Origin:', origin);

      return callback(
        new Error(`CORS Error: ${origin} is not allowed`)
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],

    exposedHeaders: [
      'Authorization',
    ],
  })
);

// Handle OPTIONS request
app.options('*', cors());

// ================================
// Rate Limiter
// ================================

const limiter = rateLimit({
  windowMs: env.rateLimit.windowMs,

  max: env.rateLimit.max,

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    statusCode: 429,
    error: 'TOO_MANY_REQUESTS',
    message: 'Too many requests. Please try again later.',
  },
});

app.use('/api', limiter);

// ================================
// Body Parser
// ================================

app.use(express.json({ limit: '10mb' }));

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ================================
// Logger
// ================================

if (env.nodeEnv !== 'test') {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) =>
          logger.info(message.trim()),
      },
    })
  );
}

// ================================
// Swagger
// ================================

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss:
      '.swagger-ui .topbar { display:none }',

    customSiteTitle: 'AI Business OS API',
  })
);

// ================================
// Static Uploads
// ================================

app.use(
  '/uploads',
  express.static(path.join(env.upload.dir))
);

// ================================
// Routes
// ================================

app.use('/api/v1', routes);

// ================================
// Root
// ================================

app.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'AI Business OS API Running',
    version: 'v1',
  });
});

// ================================
// Health
// ================================

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
});

// ================================
// Error Handler
// ================================

app.use(notFoundHandler);

app.use(errorHandler);

// ================================
// Start Server
// ================================

async function startServer(): Promise<void> {
  try {
    await connectDB();

    app.listen(env.port, () => {
      logger.info(
        `Server running on http://localhost:${env.port}`
      );

      logger.info(
        `Swagger: http://localhost:${env.port}/api-docs`
      );

      logger.info(
        `Health: http://localhost:${env.port}/health`
      );
    });
  } catch (error) {
    logger.error(error as Error);

    process.exit(1);
  }
}

startServer();

export default app;
