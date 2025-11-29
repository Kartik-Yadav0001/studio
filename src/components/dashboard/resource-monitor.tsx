'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Resource } from '@/lib/types';
import { Lock, Server, Unlock } from 'lucide-react';

interface ResourceMonitorProps {
  resources: Resource[];
}

export function ResourceMonitor({ resources }: ResourceMonitorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Server />
            Shared Resources
        </CardTitle>
        <CardDescription>Mutex lock status on shared resources.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-start justify-between p-3 rounded-lg bg-secondary/50 border">
            <div>
              <p className="font-semibold">{resource.id}</p>
              {resource.lockedByThreadId !== null ? (
                <p className="text-sm text-destructive">Locked by Thread {resource.lockedByThreadId}</p>
              ) : (
                <p className="text-sm text-green-400">Available</p>
              )}
              {resource.queue.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">Waiting: Thread(s) {resource.queue.join(', ')}</p>
              )}
            </div>
            {resource.lockedByThreadId !== null ? (
              <Lock className="h-5 w-5 text-destructive flex-shrink-0" />
            ) : (
              <Unlock className="h-5 w-5 text-green-400 flex-shrink-0" />
            )}
          </div>
        ))}
         {resources.length === 0 && <p className="text-sm text-muted-foreground text-center">No resources configured.</p>}
      </CardContent>
    </Card>
  );
}
