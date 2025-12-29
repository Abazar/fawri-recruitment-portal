import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import dotenv from 'dotenv';
import { connectDatabase, getDatabaseLastError, isDatabaseConnected } from './config/database';
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';

// Load environment variables for local development only
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const PORT = Number(process.env.API_PORT) || 3001;
const HOST = '0.0.0.0';

// Create Fastify instance
const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Security headers
  await server.register(helmet, {
    contentSecurityPolicy: false, // Disable for development
  });
}

function registerDbGuard() {
  server.addHook('preHandler', async (request, reply) => {
    // Always allow health checks even if DB is down
    if (request.url === '/health') return;

    // For API routes, require DB connectivity
    if (request.url.startsWith('/api/') && !isDatabaseConnected()) {
      return reply.code(503).send({
        success: false,
        error: {
          code: 'DB_UNAVAILABLE',
          message:
            'Database is not connected yet. If you are using MongoDB Atlas, verify your IP access list is Active, then retry in a moment.',
        },
        timestamp: new Date().toISOString(),
      });
    }
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  server.get('/health', async () => {
    return {
      success: true,
      message: 'Fawri Recruitment API is running',
      dbConnected: isDatabaseConnected(),
      dbLastError: getDatabaseLastError(),
      timestamp: new Date().toISOString(),
    };
  });

  // API routes
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(applicationRoutes, { prefix: '/api/v1/applications' });
}

// Start server
async function start() {
  try {
    // Register plugins and routes
    await registerPlugins();
    registerDbGuard();
    await registerRoutes();

    // Start DB connection in the background (keeps retrying)
    // so the API can come up even while Atlas IP rules are still activating.
    void connectDatabase();

    // Start listening
    await server.listen({ port: PORT, host: HOST });

    server.log.info(`Fawri Recruitment API Server running on http://localhost:${PORT}`);
    server.log.info(`Health check: http://localhost:${PORT}/health`);
    server.log.info(`Auth API: http://localhost:${PORT}/api/v1/auth`);
    server.log.info(`Applications API: http://localhost:${PORT}/api/v1/applications`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  server.log.info('SIGTERM received, shutting down gracefully...');
  await server.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  server.log.info('SIGINT received, shutting down gracefully...');
  await server.close();
  process.exit(0);
});

// Start the server
start();
