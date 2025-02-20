import { auth } from '@/auth';

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h1 className="text-4xl font-bold">Welcome to Forms App</h1>
      {session?.user ? (
        <p className="text-xl">Welcome back, {session.user.name}!</p>
      ) : (
        <p className="text-xl">Please sign in to create and manage forms.</p>
      )}
    </div>
  );
}
