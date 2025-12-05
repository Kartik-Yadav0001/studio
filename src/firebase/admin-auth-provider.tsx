'use client';

import { doc } from "firebase/firestore";
import { useDoc, useFirestore, useUser } from ".";
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader } from "lucide-react";

interface AdminAuthProviderProps {
    children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const adminRoleRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'roles_admin', user.uid);
    }, [user, firestore]);

    const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);
    
    const isLoading = isUserLoading || isAdminRoleLoading;
    const isNotAdmin = !isLoading && !adminRole;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isNotAdmin) {
        return (
            <Card className="max-w-md mx-auto mt-10 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You do not have permission to view this page.</p>
                    <p className="text-muted-foreground text-sm mt-2">
                        Please contact your system administrator if you believe this is an error.
                    </p>
                </CardContent>
            </Card>
        );
    }
    
    return <>{children}</>;
}
