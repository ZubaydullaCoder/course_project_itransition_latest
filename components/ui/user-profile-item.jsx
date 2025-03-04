// components/ui/user-profile-item.jsx
import { MenuLink } from './menu-link';

/**
 * User profile information menu item
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object with name, email, and role
 */
export function UserProfileItem({ user }) {
  return (
    <MenuLink href="/profile">
      <div className="flex flex-col w-full">
        <span className="font-medium truncate">{user.name}</span>
        <span className="text-xs text-muted-foreground mt-1 truncate">
          {user.email}
        </span>
        {user.role === 'ADMIN' && (
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">
            Admin
          </span>
        )}
      </div>
    </MenuLink>
  );
}
