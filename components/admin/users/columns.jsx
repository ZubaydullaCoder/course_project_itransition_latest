// components/admin/users/columns.jsx
'use client';

import { Badge } from '@/components/ui/badge';
import { UserActions } from './user-actions';

export const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role');
      return (
        <Badge variant={role === 'ADMIN' ? 'default' : 'secondary'}>
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive');
      return (
        <Badge variant={isActive ? 'success' : 'destructive'}>
          {isActive ? 'Active' : 'Blocked'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <UserActions user={row.original} />,
  },
];
