'use server';

import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma/client';
import { RegisterSchema } from '@/lib/utils/validators';

export async function registerUser(data) {
  try {
    // Validate data
    RegisterSchema.parse(data);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return { success: 'Registration successful' };
  } catch (error) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    return { error: 'Something went wrong' };
  }
}
