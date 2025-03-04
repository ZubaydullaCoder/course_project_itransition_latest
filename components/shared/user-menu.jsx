// components/shared/user-menu.jsx
import { UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuWrapper } from '@/components/ui/dropdown-menu-wrapper';
import { UserMenuContent } from './user-menu-content';

export function UserMenu({ user, handleSignOut }) {
  return (
    <DropdownMenuWrapper
      trigger={
        <Button variant="ghost" size="icon" className="relative">
          <UserIcon className="h-5 w-5" />
        </Button>
      }
      contentClassName="w-56"
    >
      <UserMenuContent user={user} handleSignOut={handleSignOut} />
    </DropdownMenuWrapper>
  );
}
