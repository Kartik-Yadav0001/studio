'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, FirebaseClientProvider } from '@/firebase';
import { collection } from 'firebase/firestore';

import { Header } from '@/components/layout/header';
import { AdminControls } from '@/components/admin/admin-controls';
import { UserTable } from '@/components/admin/user-table';
import { EditUserDialog } from '@/components/admin/edit-user-dialog';

import type { UserProfile } from '@/lib/types';
import { AdminStats } from '@/components/admin/admin-stats';
import { AdminAuthProvider } from '@/firebase/admin-auth-provider';

function AdminPageContent() {
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
        <AdminAuthProvider>
          <div className="max-w-[1200px] mx-auto">
            <h1 className="text-3xl font-bold mb-6">Authentication Admin</h1>
            <div className="space-y-6">
              <AdminStats users={users || []} isLoading={isLoading} />
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
        </AdminAuthProvider>
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


export default function AdminPage() {
  return (
    <FirebaseClientProvider>
      <AdminPageContent />
    </FirebaseClientProvider>
  )
}
