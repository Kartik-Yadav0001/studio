'use client';

import { Header } from '@/components/layout/header';
import { AdminAuthProvider } from '@/firebase/admin-auth-provider';
import { EmulatorCard } from '@/components/admin/emulators/emulator-card';
import { SnapshotManager } from '@/components/admin/emulators/snapshot-manager';
import { Database, Shield, FunctionSquare } from 'lucide-react';
import type { Emulator } from '@/components/admin/emulators/types';
import { FirebaseClientProvider } from '@/firebase';

const emulators: Emulator[] = [
    {
        name: 'Auth',
        port: 9099,
        uiPort: 0,
        Icon: Shield,
        description: 'Firebase Authentication Emulator for user management and sign-in.',
    },
    {
        name: 'Firestore',
        port: 8080,
        uiPort: 4000,
        Icon: Database,
        description: 'Firestore Emulator for a local NoSQL database.',
    },
    {
        name: 'Functions',
        port: 5001,
        uiPort: 4001,
        Icon: FunctionSquare,
        description: 'Cloud Functions Emulator for running serverless backend code.',
    },
];


function EmulatorsAdminPageContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <AdminAuthProvider>
            <div className="max-w-[1400px] mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Emulator Control Panel</h1>
                    <p className="text-muted-foreground">Manage your local Firebase development environment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {emulators.map(emulator => (
                        <EmulatorCard key={emulator.name} emulator={emulator} />
                    ))}
                </div>

                <SnapshotManager />

            </div>
        </AdminAuthProvider>
      </main>
    </div>
  );
}

export default function EmulatorsAdminPage() {
    return (
        <FirebaseClientProvider>
            <EmulatorsAdminPageContent />
        </FirebaseClientProvider>
    )
}