'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Thread, ThreadStatus } from '@/lib/types';
import { Circle, Cpu, Loader, PauseCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

const statusConfig: Record<
  ThreadStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  idle: { label: 'Idle', icon: Circle, color: 'text-muted-foreground/60' },
  running: { label: 'Running', icon: Loader, color: 'text-primary animate-spin' },
  waiting: { label: 'Waiting', icon: PauseCircle, color: 'text-yellow-400' },
};

function ThreadVisual({ thread }: { thread: Thread }) {
  const status = statusConfig[thread.status];
  const Icon = status.icon;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative flex flex-col items-center justify-center aspect-square rounded-lg bg-secondary/50 border border-transparent hover:border-primary/50 transition-colors duration-300">
            <Icon className={`h-6 w-6 ${status.color}`} />
            <span className="absolute top-0 right-1 text-[10px] text-muted-foreground">{thread.id}</span>
            {thread.status === 'running' && thread.progress > 0 && (
                <Progress value={thread.progress} className="absolute bottom-1 left-1 right-1 h-1 bg-primary/20"/>
            )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Thread ID: {thread.id}</p>
        <p>Status: <span className="font-semibold">{status.label}</span></p>
        {thread.currentTaskId !== null && <p>Task ID: {thread.currentTaskId}</p>}
        {thread.status === 'running' && <p>Progress: {thread.progress.toFixed(0)}%</p>}
      </TooltipContent>
    </Tooltip>
  );
}

interface ThreadGridProps {
  threads: Thread[];
}

export function ThreadGrid({ threads }: ThreadGridProps) {
  const summary = threads.reduce(
    (acc, thread) => {
      acc[thread.status]++;
      return acc;
    },
    { idle: 0, running: 0, waiting: 0 } as Record<ThreadStatus, number>
  );

  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Cpu/>
                Thread Pool Activity
            </CardTitle>
            <CardDescription className='flex flex-wrap gap-x-4 gap-y-1'>
                <span>Total: <span className="font-semibold text-foreground">{threads.length}</span></span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Running: <span className="text-primary font-semibold">{summary.running}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  Waiting: <span className="text-yellow-400 font-semibold">{summary.waiting}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
                  Idle: <span className="text-muted-foreground font-semibold">{summary.idle}</span>
                </span>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2">
                    {threads.map((thread) => (
                        <ThreadVisual key={thread.id} thread={thread} />
                    ))}
                </div>
            </TooltipProvider>
        </CardContent>
    </Card>
  );
}
