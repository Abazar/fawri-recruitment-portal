import { FastifyInstance } from 'fastify';
import {
  getMyApplication,
  updateMyApplication,
  submitApplication,
  getAllApplications,
  getApplicationById,
} from '../controllers/applicationController';
import { authenticate, authorize } from '../middleware/auth';

export default async function applicationRoutes(fastify: FastifyInstance) {
  // Applicant routes (protected)
  fastify.get('/my-application', { preHandler: [authenticate, authorize('applicant')] }, getMyApplication);
  fastify.put('/my-application', { preHandler: [authenticate, authorize('applicant')] }, updateMyApplication);
  fastify.post('/my-application/submit', { preHandler: [authenticate, authorize('applicant')] }, submitApplication);

  // Admin/HR routes (protected)
  fastify.get(
    '/',
    { preHandler: [authenticate, authorize('super_admin', 'hr_admin', 'support')] },
    getAllApplications
  );
  fastify.get(
    '/:id',
    { preHandler: [authenticate, authorize('super_admin', 'hr_admin', 'support')] },
    getApplicationById
  );
}
