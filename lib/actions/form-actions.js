'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';

export async function getTemplateWithQuestions(templateId) {
  try {
    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        isPublic: true,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!template) {
      return { error: 'Form not found or not public' };
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
  console.log('Submitting form response', templateId, formData);
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

    console.log('Existing response', existingResponse);

    // Get template questions for validation
    const template = await prisma.template.findUnique({
      where: { id: templateId },
      include: { questions: true },
    });

    console.log('Template', template);

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

    const response = await prisma.formResponse.findFirst({
      where: {
        id: responseId,
        template: {
          authorId: session.user.id,
        },
      },
    });

    if (!response) {
      return { error: 'Response not found or access denied' };
    }

    await prisma.formResponse.delete({
      where: { id: responseId },
    });

    return { success: 'Response deleted successfully' };
  } catch (error) {
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
