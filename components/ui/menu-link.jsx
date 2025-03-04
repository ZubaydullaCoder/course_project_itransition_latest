// components/ui/menu-link.jsx
import Link from 'next/link';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

/**
 * Reusable menu link component that combines DropdownMenuItem with Next.js Link
 *
 * @param {Object} props - Component props
 * @param {string} props.href - Link destination
 * @param {React.ReactNode} props.children - Content to display
 * @param {Function} props.onClick - Optional click handler
 * @param {string} props.className - Additional classes
 * @param {boolean} props.hideOnDesktop - Whether to hide this link on desktop
 */
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
