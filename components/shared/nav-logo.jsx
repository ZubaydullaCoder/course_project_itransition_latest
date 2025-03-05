
import Link from 'next/link';

export function NavLogo() {
  return (
    <Link href="/" className="hidden md:block font-semibold">
      Forms App
    </Link>
  );
}
