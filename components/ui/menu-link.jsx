
import Link from 'next/link';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';


export function MenuLink({
  href,
  children,
  onClick,
  className = 'w-full cursor-pointer',
  hideOnDesktop = false,
}) {
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <DropdownMenuItem
      asChild
      className={hideOnDesktop ? 'md:hidden' : undefined}
    >
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
    </DropdownMenuItem>
  );
}
