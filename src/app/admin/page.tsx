'use client';

import { useMemo, useState } from 'react';
import { useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Header } from '@/components/layout/header';
import { AdminControls } from '@/components/admin/admin-controls';
import { UserTable } from '@/components/admin/user-table';
import { EditUserDialog } from '@/components/admin/edit-user-dialog';

import type { UserProfile } from '@/lib/types';

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  
  const firestore = useFirestore();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'users');
  }, [firestore]);

  const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        user.email?.toLowerCase().includes(searchLower) ||
        user.id.toLowerCase().includes(searchLower) ||
        user.phoneNumber?.includes(searchQuery);

      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'enabled' && !user.isDisabled) ||
        (statusFilter === 'disabled' && user.isDisabled);
        
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, statusFilter]);

  const handleEditUser = (user: UserProfile) => {
    setEditingUser(user);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-3xl font-bold mb-6">Authentication Admin</h1>
          <div className="space-y-6">
            <AdminControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              users={users || []}
            />
            <UserTable 
              users={filteredUsers} 
              isLoading={isLoading}
              onEditUser={handleEditUser}
            />
          </div>
        </div>
      </main>
      {editingUser && (
        <EditUserDialog 
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
