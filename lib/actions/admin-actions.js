// lib/actions/admin-actions.js
'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma/client';

export async function getUsers() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return { data: users };
  } catch (error) {
    return { error: 'Failed to fetch users' };
  }
}

export async function updateUserStatus(userId, isActive) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
      return { error: 'Not authorized' };
    }

    // Prevent self-blocking
    if (userId === session.user.id) {
      return { error: 'Cannot modify own account' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });

    return { success: 'User status updated' };
  } catch (error) {
    return { error: 'Failed to update user' };
  }
}
