'use client';

import { doc } from "firebase/firestore";
import { useDoc, useFirestore, useUser } from ".";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminAuthProviderProps {
    children: React.ReactNode;
}

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const adminRoleRef = useMemo(() => {
        if (!user || !firestore) return null;
        return doc(firestore, 'roles_admin', user.uid);
    }, [user, firestore]);

    const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);
    
    const isLoading = isUserLoading || isAdminRoleLoading;
    const isNotAdmin = !isLoading && !adminRole;

    const copyToClipboard = () => {
        if(!user) return;
        navigator.clipboard.writeText(user.uid);
        toast({
            title: "UID Copied!",
            description: "The user's UID has been copied to your clipboard.",
        })
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-48">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Verifying admin permissions...</p>
            </div>
        );
    }

    if (isNotAdmin) {
        return (
            <Card className="max-w-2xl mx-auto mt-10 border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle />
                        Access Denied
                    </CardTitle>
                    <CardDescription>
                        You do not have the required permissions to view this page. Access is restricted to administrators.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="font-semibold">How to gain access:</p>
                    <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground bg-secondary/30 p-4 rounded-md border">
                        <li>
                            Log into the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-primary">Firebase Console</a> and select your project.
                        </li>
                        <li>
                            Go to the <strong>Firestore Database</strong> section.
                        </li>
                        <li>
                            Click <strong>+ Start collection</strong> and enter `roles_admin` as the Collection ID.
                        </li>
                        <li>
                            For the **Document ID**, paste the UID of the user you want to make an admin.
                        </li>
                        <li>
                            You can add a field (e.g., `isAdmin: true`) but it's not required. Click <strong>Save</strong>.
                        </li>
                        <li>
                            Refresh this page. The user will now have admin access.
                        </li>
                    </ol>
                    {user && (
                        <div className="p-3 border rounded-md bg-background">
                            <p className="text-sm font-medium">Your User ID (UID):</p>
                            <div className="flex items-center justify-between gap-4 mt-1">
                                <p className="text-sm font-mono text-muted-foreground truncate">{user.uid}</p>
                                <Button variant="outline" size="sm" onClick={copyToClipboard}>Copy UID</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        );
    }
    
    return <>{children}</>;
}
