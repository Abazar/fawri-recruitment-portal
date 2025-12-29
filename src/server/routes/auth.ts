import { FastifyInstance } from 'fastify';
import { register, login, me } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/register', register);
  fastify.post('/login', login);

  // Protected routes
  fastify.get('/me', { preHandler: authenticate }, me);
}
