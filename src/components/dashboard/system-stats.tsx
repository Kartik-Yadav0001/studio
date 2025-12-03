'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Hourglass, ListTodo, Zap } from "lucide-react";

interface SystemStatsProps {
    tasksRemaining: number;
    completedTasks: number;
    throughput: number;
    threadUtilization: number;
}

export function SystemStats({ tasksRemaining, completedTasks, throughput, threadUtilization }: SystemStatsProps) {
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Tasks Remaining</CardTitle>
                    <Hourglass className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{tasksRemaining}</div>
                    <p className="text-xs text-muted-foreground">Tasks in the queue waiting for a thread.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                    <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedTasks}</div>
                    <p className="text-xs text-muted-foreground">Total tasks processed since simulation start.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{throughput.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">Tasks completed per second.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Thread Utilization</CardTitle>
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{threadUtilization.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Percentage of threads currently running.</p>
                </CardContent>
            </Card>
        </>
    );
}
