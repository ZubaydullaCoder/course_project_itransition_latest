// components/ui/submenu.jsx
import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';

/**
 * Reusable submenu component for dropdown menus
 *
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the submenu trigger
 * @param {React.ReactNode} props.children - Submenu content
 * @param {string} props.width - Width class for the submenu content
 */
export function SubMenu({ label, children, width = 'w-48' }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span>{label}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className={width}>
          {children}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
