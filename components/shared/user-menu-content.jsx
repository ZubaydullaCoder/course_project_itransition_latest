import Link from 'next/link';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MenuLink } from '@/components/ui/menu-link';
import { SubMenu } from '@/components/ui/submenu';
import { UserProfileItem } from '@/components/ui/user-profile-item';

export function UserMenuContent({ user, handleSignOut }) {
  // Create a wrapper function that prevents the default behavior
  const handleSignOutClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    handleSignOut(user);
  };

  return (
    <>
      <UserProfileItem user={user} />
      <DropdownMenuSeparator />

      {user.role === 'ADMIN' && (
        <>
          <SubMenu label="Admin Panel">
            <MenuLink href="/admin/users">Users Management</MenuLink>
            <MenuLink href="/admin/templates">Templates Management</MenuLink>
            <MenuLink href="/admin/responses">Responses Management</MenuLink>
          </SubMenu>
          <DropdownMenuSeparator />
        </>
      )}

      <SubMenu label="My Content">
        <MenuLink href="/profile?tab=templates">My Templates</MenuLink>
        <MenuLink href="/profile?tab=responses">My Responses</MenuLink>
      </SubMenu>

      <MenuLink href="/templates" hideOnDesktop>
        Templates
      </MenuLink>

      <DropdownMenuSeparator />

      {/* Modified sign out link with explicit event prevention */}
      <MenuLink href="#" onClick={handleSignOutClick}>
        Sign Out
      </MenuLink>
    </>
  );
}
