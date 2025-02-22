import { Inter } from 'next/font/google';
import { auth } from '@/auth';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import { SessionProvider } from '@/providers/session-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Forms App',
  description: 'Create and share forms easily',
};

export default async function RootLayout({ children }) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
