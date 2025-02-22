'use client';

import Image from 'next/image';

export function AuthLayout({ children }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-zinc-900/90" /> {/* Dark overlay */}
        <Image
          src="/images/145.jpg"
          alt="Authentication background"
          fill
          className="absolute inset-0 object-cover"
          priority
          quality={100}
        />
        {/* Content overlay */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <h1>Forms App</h1>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              Create and share forms, surveys, and quizzes easily
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {children}
        </div>
      </div>
    </div>
  );
}
