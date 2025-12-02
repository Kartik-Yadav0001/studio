'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import type { LogEntry } from '@/lib/types';
import { ListChecks, AlertTriangle, CheckCircle } from 'lucide-react';

const logTypeConfig: Record<LogEntry['type'], { icon: React.ElementType; color: string; }> = {
  info: { icon: ListChecks, color: 'text-sky-400' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400' },
  success: { icon: CheckCircle, color: 'text-green-400' },
};

interface TaskLogProps {
  log: LogEntry[];
}

export function TaskLog({ log }: TaskLogProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListChecks />
          Task Event Log
        </CardTitle>
        <CardDescription>
          A real-time stream of events from the thread simulation.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full max-h-[600px] pr-4">
          <div className="space-y-3">
            {log.map((entry) => {
              const config = logTypeConfig[entry.type];
              const Icon = config.icon;
              return (
                <div key={entry.id} className="flex items-start gap-3 text-sm">
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.color}`} />
                  <div className='flex-grow'>
                    <p className="text-muted-foreground leading-tight">
                        <span className="font-mono text-xs">{entry.timestamp}</span>
                    </p>
                    <p className="leading-tight">{entry.message}</p>
                  </div>
                </div>
              );
            })}
             {log.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Simulation not started. Press Start to see events.</p>}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
