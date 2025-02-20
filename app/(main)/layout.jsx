import { MainNav } from '@/components/shared/main-nav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
