// components/forms/responses-table.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MoreVertical } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { deleteResponse } from '@/lib/actions/form-actions';

export function ResponsesTable({ responses }) {
  const { toast } = useToast();
  const [items, setItems] = useState(responses);

  async function handleDelete(id) {
    try {
      const result = await deleteResponse(id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setItems(items.filter((item) => item.id !== id));
      toast({
        title: 'Success',
        description: 'Response deleted successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    }
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No responses found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Template</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((response) => (
          <TableRow key={response.id}>
            <TableCell>
              <Link
                href={`/templates/${response.templateId}/responses/${response.id}`}
                className="hover:underline"
              >
                {response.template.title}
              </Link>
            </TableCell>
            <TableCell>{formatDate(response.createdAt)}</TableCell>
            <TableCell>{formatDate(response.updatedAt)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/forms/${response.templateId}`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleDelete(response.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
