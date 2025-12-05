'use client';

import type { UserProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserCheck, UserX, Star } from "lucide-react";

interface AdminStatsProps {
    users: UserProfile[];
    isLoading: boolean;
}

const StatCard = ({ title, value, icon: Icon, isLoading }: { title: string, value: number, icon: React.ElementType, isLoading: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <Skeleton className="h-8 w-20" />
            ) : (
                <div className="text-2xl font-bold">{value}</div>
            )}
        </CardContent>
    </Card>
)

export function AdminStats({ users, isLoading }: AdminStatsProps) {

    const stats = {
        totalUsers: users.length,
        enabledUsers: users.filter(u => !u.isDisabled).length,
        disabledUsers: users.filter(u => u.isDisabled).length,
        usersWithClaims: users.filter(u => u.customClaims && Object.keys(JSON.parse(typeof u.customClaims === 'string' ? u.customClaims : '{}')).length > 0).length,
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Users" value={stats.totalUsers} icon={Users} isLoading={isLoading} />
            <StatCard title="Enabled Users" value={stats.enabledUsers} icon={UserCheck} isLoading={isLoading} />
            <StatCard title="Disabled Users" value={stats.disabledUsers} icon={UserX} isLoading={isLoading} />
            <StatCard title="Users with Claims" value={stats.usersWithClaims} icon={Star} isLoading={isLoading} />
        </div>
    )
}
