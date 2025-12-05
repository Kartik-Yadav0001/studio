'use client';

import { Header } from '@/components/layout/header';
import { FunctionsList } from '@/components/admin/functions/functions-list';
import { LogViewer } from '@/components/admin/functions/log-viewer';
import { AdminAuthProvider } from '@/firebase/admin-auth-provider';
import { FirebaseClientProvider } from '@/firebase';

function FunctionsAdminPageContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <AdminAuthProvider>
            <div className="max-w-[1400px] mx-auto space-y-6">
                <h1 className="text-3xl font-bold">Functions & Logs</h1>
                <FunctionsList />
                <LogViewer />
            </div>
        </AdminAuthProvider>
      </main>
    </div>
  );
}

export default function FunctionsAdminPage() {
    return (
        <FirebaseClientProvider>
            <FunctionsAdminPageContent />
        </FirebaseClientProvider>
    )
}