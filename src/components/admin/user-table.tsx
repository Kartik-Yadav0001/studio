'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreHorizontal, Pencil } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

interface UserTableProps {
  users: UserProfile[];
  isLoading: boolean;
  onEditUser: (user: UserProfile) => void;
}

export function UserTable({ users, isLoading, onEditUser }: UserTableProps) {
  const { toast } = useToast();
  const firestore = useFirestore();

  const handleToggleStatus = async (user: UserProfile) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.id);
    try {
      await updateDoc(userRef, { isDisabled: !user.isDisabled });
      toast({
        title: 'User status updated',
        description: `User ${user.email} has been ${!user.isDisabled ? 'disabled' : 'enabled'}.`,
      });
    } catch (error: any) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSendPasswordReset = (email: string | null) => {
    if (!email) {
        toast({ title: 'Cannot send password reset', description: 'User does not have an email.', variant: 'destructive'});
        return;
    };
    // In a real app, this would call a Firebase Function
    toast({
        title: 'Password Reset Email Sent',
        description: `A password reset link has been sent to ${email}.`,
    });
  }


  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Phone Number</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-48 mt-1" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-8 w-8" />
                </TableCell>
              </TableRow>
            ))
          ) : users.length === 0 ? (
            <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                    No users found.
                </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.email || 'Anonymous'}</div>
                  <div className="text-sm text-muted-foreground">{user.id}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isDisabled ? 'destructive' : 'default'}>
                    {user.isDisabled ? 'Disabled' : 'Enabled'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.phoneNumber || 'N/A'}
                </TableCell>
                <TableCell>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEditUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Custom Claims
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                                {user.isDisabled ? 'Enable' : 'Disable'} User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendPasswordReset(user.email)}>
                                Send Password Reset
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
