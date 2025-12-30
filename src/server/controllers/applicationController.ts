import { FastifyRequest, FastifyReply } from 'fastify';
import Application from '../models/Application';
import User from '../models/User';
import { z } from 'zod';

const updateApplicationSchema = z.object({
  personalInfo: z
    .object({
      maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
      numberOfDependents: z.number().min(0).max(20).optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      emergencyContactRelationship: z.string().optional(),
    })
    .optional(),
  experience: z
    .object({
      hasMotorcycleLicense: z.boolean(),
      licenseNumber: z.string().optional(),
      licenseIssueDate: z.string().optional(),
      licenseExpiryDate: z.string().optional(),
      yearsOfRidingExperience: z.number().min(0).max(50).optional(),
      hasCommercialExperience: z.boolean().optional(),
      previousEmployer: z.string().optional(),
      previousJobTitle: z.string().optional(),
    })
    .optional(),
  preferences: z
    .object({
      preferredStartDate: z.string().optional(),
      contractDuration: z.enum(['6_months', '1_year', '2_years', 'open']).optional(),
      willingToRelocate: z.boolean().optional(),
    })
    .optional(),
});

export const getMyApplication = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.userId;

    const application = await Application.findOne({ userId, deletedAt: { $exists: false } })
      .populate('userId', 'email profile.firstName profile.lastName profile.phone')
      .sort({ createdAt: -1 });

    if (!application) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'No application found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return reply.status(200).send({
      success: true,
      data: { application },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get application error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching application',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const updateMyApplication = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.userId;
    const validatedData = updateApplicationSchema.parse(request.body);

    const application = await Application.findOne({ userId, deletedAt: { $exists: false } });

    if (!application) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'No application found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Only allow updates if application is in draft status
    if (application.status !== 'draft') {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Application can only be updated in draft status',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Update application fields
    if (validatedData.personalInfo) {
      application.set('personalInfo', {
        ...application.get('personalInfo'),
        ...validatedData.personalInfo,
      });
    }

    if (validatedData.experience) {
      const exp = validatedData.experience;
      application.set('experience', {
        ...application.get('experience'),
        hasMotorcycleLicense: exp.hasMotorcycleLicense,
        licenseNumber: exp.licenseNumber,
        licenseIssueDate: exp.licenseIssueDate ? new Date(exp.licenseIssueDate) : undefined,
        licenseExpiryDate: exp.licenseExpiryDate ? new Date(exp.licenseExpiryDate) : undefined,
        yearsOfRidingExperience: exp.yearsOfRidingExperience,
        hasCommercialExperience: exp.hasCommercialExperience,
        previousEmployer: exp.previousEmployer,
        previousJobTitle: exp.previousJobTitle,
      });
    }

    if (validatedData.preferences) {
      const pref = validatedData.preferences;
      application.set('preferences', {
        ...application.get('preferences'),
        preferredStartDate: pref.preferredStartDate ? new Date(pref.preferredStartDate) : undefined,
        contractDuration: pref.contractDuration,
        willingToRelocate: pref.willingToRelocate ?? true,
      });
    }

    await application.save();

    return reply.status(200).send({
      success: true,
      data: { application },
      message: 'Application updated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: error.issues,
        },
        timestamp: new Date().toISOString(),
      });
    }

    console.error('Update application error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while updating application',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const submitApplication = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const userId = request.user?.userId;

    const application = await Application.findOne({ userId, deletedAt: { $exists: false } });

    if (!application) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'No application found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    if (application.status !== 'draft') {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Application has already been submitted',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Validate required fields before submission
    const experience = application.get('experience');
    if (!experience?.hasMotorcycleLicense) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'INCOMPLETE_APPLICATION',
          message: 'Please complete all required fields before submitting',
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Update status to submitted
    application.status = 'submitted';
    const statusHistory = application.get('statusHistory') || [];
    statusHistory.push({
      status: 'submitted',
      changedBy: userId as string,
      changedAt: new Date(),
      notes: 'Application submitted by applicant',
    });
    application.set('statusHistory', statusHistory);

    await application.save();

    return reply.status(200).send({
      success: true,
      data: { application },
      message: 'Application submitted successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Submit application error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while submitting application',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getAllApplications = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { status, page = 1, limit = 20 } = request.query as Record<string, unknown>;

    const query: Record<string, unknown> = { deletedAt: { $exists: false } };

    if (status) {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(query)
      .populate('userId', 'email profile.firstName profile.lastName profile.phone')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Application.countDocuments(query);

    return reply.status(200).send({
      success: true,
      data: {
        applications,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get all applications error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching applications',
      },
      timestamp: new Date().toISOString(),
    });
  }
};

export const getApplicationById = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = request.params as { id: string };

    const application = await Application.findOne({ _id: id, deletedAt: { $exists: false } })
      .populate('userId', 'email profile language')
      .populate('statusHistory.changedBy', 'profile.firstName profile.lastName');

    if (!application) {
      return reply.status(404).send({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'Application not found',
        },
        timestamp: new Date().toISOString(),
      });
    }

    return reply.status(200).send({
      success: true,
      data: { application },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred while fetching application',
      },
      timestamp: new Date().toISOString(),
    });
  }
};
