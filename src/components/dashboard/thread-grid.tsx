'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Thread, ThreadStatus, Task, TaskPriority } from '@/lib/types';
import { Circle, Cpu, Loader, PauseCircle, XCircle } from 'lucide-react';
import { Progress } from '../ui/progress';

const statusConfig: Record<
  ThreadStatus,
  { label: string; icon: React.ElementType; color: string }
> = {
  idle: { label: 'Idle', icon: Circle, color: 'text-muted-foreground/60' },
  running: { label: 'Running', icon: Loader, color: 'text-primary animate-spin' },
  waiting: { label: 'Waiting', icon: PauseCircle, color: 'text-yellow-400' },
  terminating: { label: 'Terminating', icon: XCircle, color: 'text-destructive' },
};

const priorityColors: Record<TaskPriority, string> = {
  High: 'border-red-400/80',
  Medium: 'border-yellow-400/80',
  Low: 'border-sky-400/80',
};

function ThreadVisual({ thread, task }: { thread: Thread; task: Task | undefined }) {
  const status = statusConfig[thread.status];
  const Icon = status.icon;
  const borderColor = task ? priorityColors[task.priority] : 'border-transparent';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`relative flex flex-col items-center justify-center aspect-square rounded-lg bg-secondary/50 border-2 ${borderColor} hover:bg-secondary transition-colors duration-300`}>
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
        {task && <p>Task ID: {task.id}</p>}
        {task && <p>Task Priority: {task.priority}</p>}
        {thread.status === 'running' && <p>Progress: {thread.progress.toFixed(0)}%</p>}
      </TooltipContent>
    </Tooltip>
  );
}

interface ThreadGridProps {
  threads: Thread[];
  tasks: Task[];
}

export function ThreadGrid({ threads, tasks }: ThreadGridProps) {
  const summary = threads.reduce(
    (acc, thread) => {
      acc[thread.status] = (acc[thread.status] || 0) + 1;
      return acc;
    },
    { idle: 0, running: 0, waiting: 0, terminating: 0 } as Record<ThreadStatus, number>
  );

  const taskMap = new Map(tasks.map(task => [task.id, task]));

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
                 {summary.terminating > 0 && <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  Terminating: <span className="text-destructive font-semibold">{summary.terminating}</span>
                </span>}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <TooltipProvider delayDuration={100}>
                <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2">
                    {threads.map((thread) => (
                        <ThreadVisual key={thread.id} thread={thread} task={thread.currentTaskId ? taskMap.get(thread.currentTaskId) : undefined} />
                    ))}
                </div>
            </TooltipProvider>
        </CardContent>
    </Card>
  );
}
