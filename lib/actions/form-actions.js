'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';

export async function getTemplateWithQuestions(templateId) {
  try {
    const session = await auth();

    // Build access conditions
    const where = {
      id: templateId,
      OR: [
        { isPublic: true }, // Public templates
        ...(session?.user
          ? [
              { authorId: session.user.id }, // User's own templates
              {
                allowedUsers: {
                  some: {
                    email: session.user.email,
                  },
                },
              }, // Templates where user is explicitly allowed
              ...(session.user.role === 'ADMIN' ? [{}] : []), // Admin can access all
            ]
          : []),
      ],
    };

    const template = await prisma.template.findFirst({
      where,
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!template) {
      return { error: 'Form not found or access denied' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to load form' };
  }
}

export async function checkExistingResponse(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { data: null };
    }

    const response = await prisma.formResponse.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
      include: {
        answers: true,
      },
    });

    return { data: response };
  } catch (error) {
    return { error: 'Failed to check existing response' };
  }
}

export async function submitFormResponse(templateId, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'You must be logged in to submit a response' };
    }

    // Check if response already exists
    const existingResponse = await prisma.formResponse.findUnique({
      where: {
        templateId_userId: {
          templateId,
          userId: session.user.id,
        },
      },
    });

    // Get template questions for validation
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { questions: true },
    });

    if (!template) {
      return { error: 'Form not found' };
    }

    // Create or update response
    const response = await prisma.$transaction(async (tx) => {
      // Handle existing response
      if (existingResponse) {
        // Delete existing answers
        await tx.answer.deleteMany({
          where: { formResponseId: existingResponse.id },
        });

        // Update response timestamp
        await tx.formResponse.update({
          where: { id: existingResponse.id },
          data: { updatedAt: new Date() },
        });

        return existingResponse;
      }

      // Create new response
      return await tx.formResponse.create({
        data: {
          templateId,
          userId: session.user.id,
        },
      });
    });

    // Create answers
    await prisma.answer.createMany({
      data: template.questions.map((question) => ({
        questionId: question.id,
        formResponseId: response.id,
        value: formData.get(question.id)?.toString() || '',
      })),
    });

    return {
      success: existingResponse
        ? 'Response updated successfully'
        : 'Response submitted successfully',
      data: response,
    };
  } catch (error) {
    return { error: 'Failed to submit response' };
  }
}

export async function getTemplateWithResponses(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const template = await prisma.template.findUnique({
      where: {
        id: templateId,
      },
      include: {
        questions: {
          where: { showInResults: true },
          orderBy: { order: 'asc' },
        },
        responses: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
            answers: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    // Allow access if user is admin or template owner
    const canAccess =
      session.user.role === 'ADMIN' || template.authorId === session.user.id;

    if (!canAccess) {
      return { error: 'Access denied' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to load responses' };
  }
}

export async function getResponseDetails(templateId, responseId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const response = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
        templateId,
        OR: [
          // Allow template owner
          {
            template: {
              authorId: session.user.id,
            },
          },
          // Allow response author
          {
            userId: session.user.id,
          },
          // Allow admin
          {
            user: {
              role: 'ADMIN',
            },
          },
        ],
      },
      include: {
        template: {
          select: {
            title: true,
            questions: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        answers: true,
      },
    });

    if (!response) {
      return { error: 'Response not found or access denied' };
    }

    return { data: response };
  } catch (error) {
    return { error: 'Failed to load response details' };
  }
}

export async function deleteResponse(responseId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    // First find the response with template information
    const response = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
      },
      include: {
        template: {
          select: {
            authorId: true,
          },
        },
      },
    });

    if (!response) {
      return { error: 'Response not found' };
    }

    // Check if user has permission to delete
    const canDelete =
      session.user.role === 'ADMIN' || // Admin can delete any response
      response.userId === session.user.id || // Response owner can delete their response
      response.template.authorId === session.user.id; // Template owner can delete any response

    if (!canDelete) {
      return { error: 'Not authorized to delete this response' };
    }

    // Delete the response
    await prisma.formResponse.delete({
      where: { id: responseId },
    });

    return { success: 'Response deleted successfully' };
  } catch (error) {
    console.error('Delete response error:', error);
    return { error: 'Failed to delete response' };
  }
}

export async function getUserResponses() {
  const session = await auth();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    const responses = await prisma.formResponse.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        template: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return responses;
  } catch (error) {
    return { error: 'Failed to fetch responses' };
  }
}
