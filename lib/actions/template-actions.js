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
      allowedUsers: formData.get('allowedUsers') || '',
      image: formData.get('image') || '',
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
            allowedUsers: {
              create: validatedData.allowedUsers.map((email) => ({
                email,
              })),
            },
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
      console.log({ validationError });
      return { error: 'Invalid template data' };
    }
  } catch (error) {
    return { error: 'Failed to create template' };
  }
}

// Common query builder function
async function buildTemplateQuery(options = {}) {
  const session = await auth();
  const { query, topic, tag, filter } = options;

  // Base query conditions
  let where =
    session?.user?.role === 'ADMIN'
      ? {} // Admin sees all templates
      : {
          OR: [
            { authorId: session?.user?.id }, // User's own templates
            { isPublic: true }, // Public templates
          ],
        };

  // Handle special filters
  if (filter) {
    switch (filter) {
      case 'my':
        where = {
          authorId: session?.user?.id,
        };
        break;
      case 'latest':
        // Keep base conditions but will sort by date
        break;
    }
  }

  // Add search conditions if query exists
  if (query) {
    where.OR = [
      ...(where.OR || []),
      { title: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { tags: { hasSome: [query] } },
      { topic: { contains: query, mode: 'insensitive' } },
    ];
  }

  // Add topic filter
  if (topic) {
    where.topic = topic;
  }

  // Add tag filter
  if (tag) {
    where.tags = {
      hasSome: [tag],
    };
  }

  return { where };
}

export async function getTemplates(options = {}) {
  try {
    const { where } = await buildTemplateQuery(options);
    const { filter } = options;

    const templates = await prisma.template.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: filter === 'latest' ? { createdAt: 'desc' } : undefined,
    });

    return { data: templates };
  } catch (error) {
    console.error('Failed to fetch templates:', error);
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
        questions: {
          // Add this to include questions
          orderBy: {
            order: 'asc', // Optional: order questions by their order field
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
  return getTemplates({ query });
}

export async function getTemplateForEdit(templateId) {
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
          orderBy: {
            order: 'asc',
          },
        },
        allowedUsers: {
          select: { email: true },
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
      where: { id: templateId, authorId: session.user.id },
      include: { allowedUsers: true },
    });
    if (!existingTemplate) {
      return { error: 'Template not found or access denied' };
    }

    const rawData = {
      title: formData.get('title'),
      description: formData.get('description') || '',
      topic: formData.get('topic'),
      tags: formData.get('tags') || '',
      isPublic: formData.get('isPublic') === 'true',
      allowedUsers: formData.get('allowedUsers') || '',
      image: formData.get('image') || '',
    };

    let validatedData;
    try {
      validatedData = TemplateSchema.parse(rawData);
    } catch (validationError) {
      if (validationError.errors?.length > 0) {
        return { error: validationError.errors[0].message };
      }
      return { error: 'Invalid template data' };
    }

    // Destructure allowedUsers out so it doesn't get passed if public
    const { allowedUsers, ...otherData } = validatedData;

    try {
      const questions = JSON.parse(formData.get('questions') || '[]');

      const template = await prisma.$transaction(async (tx) => {
        // Delete existing allowed users
        await tx.allowedUser.deleteMany({ where: { templateId } });

        const updateData = {
          ...otherData,
          questions: {
            deleteMany: {},
            create: questions.map((q, index) => ({
              text: q.text,
              description: q.description,
              type: q.type,
              required: q.required,
              showInResults: q.showInResults,
              order: index,
            })),
          },
          // Only add allowedUsers if template is restricted
          ...(!otherData.isPublic && allowedUsers.length > 0
            ? {
                allowedUsers: {
                  create: allowedUsers.map((email) => ({
                    email: email.toLowerCase(),
                  })),
                },
              }
            : {}),
        };

        return await tx.template.update({
          where: { id: templateId },
          data: updateData,
        });
      });

      revalidatePath('/templates');
      return { success: 'Template updated successfully', data: template };
    } catch (error) {
      console.error('Database operation error:', error);
      return { error: 'Failed to update template' };
    }
  } catch (error) {
    console.error('Template update error:', error);
    return { error: 'Failed to update template' };
  }
}

/**
 * Get latest templates with basic info
 */
export async function getLatestTemplates(limit = 5) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true, // Only public templates
        tags: {
          isEmpty: false, // Use isEmpty instead of not: null for arrays
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        responses: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return templates;
  } catch (error) {
    console.error('Failed to fetch latest templates:', error);
    return [];
  }
}

/**
 * Get most popular templates based on response count
 */
export async function getTopTemplates(limit = 5) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
      },
      take: limit,
      orderBy: {
        responses: {
          _count: 'desc',
        },
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            responses: true,
          },
        },
      },
    });

    return templates;
  } catch (error) {
    console.error('Failed to fetch top templates:', error);
    return [];
  }
}

/**
 * Get popular tags from templates
 */
export async function getPopularTags(limit = 20) {
  try {
    const templates = await prisma.template.findMany({
      where: {
        isPublic: true,
        tags: {
          isEmpty: false, // Use isEmpty: false instead of not: null for array fields
        },
      },
      select: {
        tags: true,
      },
    });

    // Process tags
    const tagCounts = templates.reduce((acc, template) => {
      if (!template.tags) return acc;

      const templateTags = template.tags;
      templateTags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });

      return acc;
    }, {});

    // Convert to array and sort by count
    const sortedTags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sortedTags;
  } catch (error) {
    console.error('Failed to fetch popular tags:', error);
    return [];
  }
}
