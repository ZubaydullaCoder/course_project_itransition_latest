'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';
import { TemplateSchema } from '../utils/validators';

export async function createTemplate(formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    // Parse and validate the form data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
    };

    try {
      const validatedData = TemplateSchema.parse(rawData);
      const questions = JSON.parse(formData.get('questions') || '[]');

      // Create template with questions in a transaction
      const template = await prisma.$transaction(async (tx) => {
        // Create template
        const template = await tx.template.create({
          data: {
            ...validatedData,
            authorId: session.user.id,
          },
        });

        // Create questions
        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q, index) => ({
              text: q.text,
              type: q.type,
              required: q.required,
              order: index,
              templateId: template.id,
            })),
          });
        }

        return template;
      });

      revalidatePath('/templates');
      return { success: 'Template created successfully', data: template };
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      return { error: 'Invalid template data' };
    }
  } catch (error) {
    return { error: 'Failed to create template' };
  }
}

export async function getTemplates() {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const isAdmin = session.user.role === 'ADMIN';

    // Fix: Simplify the where clause based on user role
    const where = isAdmin
      ? {} // Admin sees all templates
      : {
          OR: [
            { authorId: session.user.id }, // User's own templates
            { isPublic: true }, // Public templates
          ],
        };

    const templates = await prisma.template.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: templates };
  } catch (error) {
    console.error('Template fetch error:', error.message || 'Unknown error');
    return { error: 'Failed to fetch templates' };
  }
}
export async function getTemplateById(templateId) {
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
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    // Check access
    const canAccess =
      template.isPublic ||
      template.authorId === session.user.id ||
      session.user.role === 'ADMIN';

    if (!canAccess) {
      return { error: 'Access denied' };
    }

    return { data: template };
  } catch (error) {
    console.error('Template fetch error:', error);
    return { error: 'Failed to fetch template' };
  }
}

export async function deleteTemplate(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const template = await prisma.template.findUnique({
      where: { id: templateId },
      select: { authorId: true },
    });

    if (!template) {
      return { error: 'Template not found' };
    }

    if (
      template.authorId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return { error: 'Not authorized' };
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    revalidatePath('/templates');
    return { success: true };
  } catch (error) {
    console.error('Template deletion error:', error);
    return { error: 'Failed to delete template' };
  }
}

export async function searchTemplates(query) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const isAdmin = session.user.role === 'ADMIN';

    // Using ilike for case-insensitive search in PostgreSQL
    const templates = await prisma.template.findMany({
      where: {
        AND: [
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { tags: { hasSome: [query] } },
              { topic: { contains: query, mode: 'insensitive' } },
            ],
          },
          {
            OR: [{ authorId: session.user.id }, { isPublic: true }],
          },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { data: templates };
  } catch (error) {
    // Fix: Properly handle the error object
    console.error('Template search error:', error.message || 'Unknown error');
    return { error: 'Failed to search templates' };
  }
}

export async function getTemplateForEdit(templateId) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const template = await prisma.template.findFirst({
      where: {
        id: templateId,
        authorId: session.user.id,
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
      return { error: 'Template not found or access denied' };
    }

    return { data: template };
  } catch (error) {
    return { error: 'Failed to fetch template' };
  }
}

export async function updateTemplate(formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    const templateId = formData.get('id');
    if (!templateId) {
      return { error: 'Template ID is required' };
    }

    // Check template ownership
    const existingTemplate = await prisma.template.findFirst({
      where: {
        id: templateId,
        authorId: session.user.id,
      },
    });

    if (!existingTemplate) {
      return { error: 'Template not found or access denied' };
    }

    // Parse and validate the form data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
    };

    try {
      const validatedData = TemplateSchema.parse(rawData);
      const questions = JSON.parse(formData.get('questions') || '[]');

      // Update template and questions in a transaction
      const template = await prisma.$transaction(async (tx) => {
        // Update template basic info
        const updatedTemplate = await tx.template.update({
          where: { id: templateId },
          data: {
            ...validatedData,
            updatedAt: new Date(),
          },
        });

        // Delete existing questions
        await tx.question.deleteMany({
          where: { templateId },
        });

        // Create new questions
        if (questions.length > 0) {
          await tx.question.createMany({
            data: questions.map((q, index) => ({
              text: q.text,
              description: q.description,
              type: q.type,
              required: q.required,
              showInResults: q.showInResults,
              order: index,
              templateId,
            })),
          });
        }

        return updatedTemplate;
      });

      revalidatePath('/templates');
      revalidatePath(`/templates/${templateId}`);
      return { success: 'Template updated successfully', data: template };
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      return { error: 'Invalid template data' };
    }
  } catch (error) {
    return { error: 'Failed to update template' };
  }
}
