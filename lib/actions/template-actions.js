'use server';

import { auth } from '@/auth';
import prisma from '@/lib/prisma/client';
import { revalidatePath } from 'next/cache';
import { TemplateSchema } from '../utils/validators';

export async function createTemplate(formData) {
  try {
    console.log('1. Starting template creation');
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    console.log('2. Form data received:', Object.fromEntries(formData));

    // Parse and validate the form data
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
    };

    console.log('3. Raw data:', rawData);

    try {
      // Validate the data
      console.log('4. Validating data with Zod');
      const validatedData = TemplateSchema.parse(rawData);
      console.log('5. Validated data:', validatedData);

      // Create template with validated data
      const template = await prisma.template.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          topic: validatedData.topic,
          tags: validatedData.tags,
          isPublic: validatedData.isPublic,
          authorId: session.user.id,
        },
      });

      console.log('6. Template created:', template);

      revalidatePath('/templates');
      return { success: 'Template created successfully', data: template };
    } catch (validationError) {
      console.log('7. Validation error:', validationError);
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      throw validationError;
    }
  } catch (error) {
    console.error('8. Template creation error:', error);
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

export async function updateTemplate(templateId, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: 'Not authenticated' };
    }

    // Check if template exists and user has permission
    const existingTemplate = await prisma.template.findUnique({
      where: { id: templateId },
      select: { authorId: true },
    });

    if (!existingTemplate) {
      return { error: 'Template not found' };
    }

    if (
      existingTemplate.authorId !== session.user.id &&
      session.user.role !== 'ADMIN'
    ) {
      return { error: 'Not authorized' };
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

      const template = await prisma.template.update({
        where: { id: templateId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          topic: validatedData.topic,
          tags: validatedData.tags,
          isPublic: validatedData.isPublic,
        },
      });

      revalidatePath('/templates');
      revalidatePath(`/templates/${templateId}`);
      return { success: 'Template updated successfully', data: template };
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Template update error:', error.message || 'Unknown error');
    return { error: 'Failed to update template' };
  }
}
