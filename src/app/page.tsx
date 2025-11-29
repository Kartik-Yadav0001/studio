'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/layout/header';
import { AiOptimizer } from '@/components/dashboard/ai-optimizer';
import { Controls } from '@/components/dashboard/controls';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { ResourceMonitor } from '@/components/dashboard/resource-monitor';
import { ThreadGrid } from '@/components/dashboard/thread-grid';
import type { PerformanceDataPoint, Resource, Task, Thread } from '@/lib/types';

export type SimulationStatus = 'running' | 'paused' | 'stopped';

type SimulationConfig = {
  threadCount: number;
  taskCount: number;
  resourceCount: number;
  simulationSpeed: number;
};

const MAX_HISTORY = 30;

export default function Home() {
  const [config, setConfig] = useState<SimulationConfig>({
    threadCount: 100,
    taskCount: 200,
    resourceCount: 4,
    simulationSpeed: 250,
  });
  
  const [status, setStatus] = useState<SimulationStatus>('stopped');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceDataPoint[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);

  const simulationStateRef = useRef({ threads, tasks, resources, completedTasksCount });
  useEffect(() => {
    simulationStateRef.current = { threads, tasks, resources, completedTasksCount };
  }, [threads, tasks, resources, completedTasksCount]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetSimulation = useCallback(() => {
    setStatus('stopped');
    
    const newThreads = Array.from({ length: config.threadCount }, (_, i) => ({
      id: i + 1,
      status: 'idle' as const,
      currentTaskId: null,
      progress: 0,
    }));

    const newResources = Array.from({ length: config.resourceCount }, (_, i) => ({
      id: `Resource ${String.fromCharCode(65 + i)}`,
      lockedByThreadId: null,
      queue: [],
    }));

    const newTasks = Array.from({ length: config.taskCount }, (_, i) => {
        const duration = Math.floor(Math.random() * 40) + 10;
        const needsResource = config.resourceCount > 0 && Math.random() < 0.3;
        const resourceId = needsResource
            ? `Resource ${String.fromCharCode(65 + Math.floor(Math.random() * config.resourceCount))}`
            : null;
        return {
            id: i + 1,
            duration: duration,
            remaining: duration,
            resourceId: resourceId,
        }
    });

    setThreads(newThreads);
    setResources(newResources);
    setTasks(newTasks);
    setPerformanceHistory([]);
    setCompletedTasksCount(0);
  }, [config]);

  useEffect(() => {
    resetSimulation();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.threadCount, config.taskCount, config.resourceCount]);

  const runSimulationTick = useCallback(() => {
    let { threads: currentThreads, tasks: currentTasks, resources: currentResources, completedTasksCount: currentCompletedTasks } = simulationStateRef.current;
    
    let newThreads = JSON.parse(JSON.stringify(currentThreads));
    let newTasks = JSON.parse(JSON.stringify(currentTasks));
    let newResources = JSON.parse(JSON.stringify(currentResources));
    let completedInTick = 0;

    newThreads.forEach((thread: Thread) => {
      if (thread.status === 'running' && thread.currentTaskId !== null) {
        const task = newTasks.find((t: Task) => t.id === thread.currentTaskId);
        if (task) {
          task.remaining--;
          thread.progress = 100 * (1 - task.remaining / task.duration);
          if (task.remaining <= 0) {
            thread.status = 'idle';
            thread.currentTaskId = null;
            thread.progress = 0;
            completedInTick++;
            if (task.resourceId) {
              const resource = newResources.find((r: Resource) => r.id === task.resourceId);
              if (resource && resource.lockedByThreadId === thread.id) {
                resource.lockedByThreadId = null;
              }
            }
          }
        }
      }
    });

    newResources.forEach((resource: Resource) => {
      if (resource.lockedByThreadId === null && resource.queue.length > 0) {
        const nextThreadId = resource.queue.shift();
        const thread = newThreads.find((t: Thread) => t.id === nextThreadId);
        if (thread && thread.status === 'waiting') {
          resource.lockedByThreadId = thread.id;
          thread.status = 'running';
        }
      }
    });

    const unassignedTasks = newTasks.filter((t: Task) => t.remaining > 0 && !newThreads.some((th: Thread) => th.currentTaskId === t.id));
    let taskQueueIndex = 0;

    newThreads.forEach((thread: Thread) => {
      if (thread.status === 'idle' && taskQueueIndex < unassignedTasks.length) {
        const taskToAssign = unassignedTasks[taskQueueIndex++];
        thread.currentTaskId = taskToAssign.id;
        if (taskToAssign.resourceId) {
          const resource = newResources.find((r: Resource) => r.id === taskToAssign.resourceId);
          if (resource) {
            if (resource.lockedByThreadId === null) {
              resource.lockedByThreadId = thread.id;
              thread.status = 'running';
            } else {
              thread.status = 'waiting';
              if (!resource.queue.includes(thread.id)) {
                resource.queue.push(thread.id);
              }
            }
          }
        } else {
          thread.status = 'running';
        }
      }
    });
    
    setThreads(newThreads);
    setTasks(newTasks);
    setResources(newResources);
    if(completedInTick > 0) {
      setCompletedTasksCount(prev => prev + completedInTick);
    }

    const runningThreads = newThreads.filter((t: Thread) => t.status === 'running').length;
    const totalThreads = newThreads.length;
    const cpuUsage = totalThreads > 0 ? (runningThreads / totalThreads) * 100 + Math.random() * 5 : 0;
    const activeTasks = newTasks.filter((t: Task) => t.remaining > 0).length;
    const memoryUsage = (totalThreads * 0.1 + activeTasks * 0.02) * (1 + Math.random() * 0.1);

    const newPoint = {
      name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      cpuUsage: Math.min(100, parseFloat(cpuUsage.toFixed(1))),
      memoryUsage: Math.min(100, parseFloat(memoryUsage.toFixed(1))),
      completedTasks: currentCompletedTasks + completedInTick
    };

    setPerformanceHistory(prev => [...prev, newPoint].slice(-MAX_HISTORY));

  }, []);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(runSimulationTick, config.simulationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, config.simulationSpeed, runSimulationTick]);

  const handleUpdateConfig = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key !== 'simulationSpeed') {
        setStatus('stopped');
    }
  };
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/20 dark:bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className='lg:col-span-1 flex flex-col gap-6'>
            <Controls 
              status={status}
              onStart={() => setStatus('running')}
              onPause={() => setStatus('paused')}
              onStop={resetSimulation}
              onStep={runSimulationTick}
              onUpdateConfig={handleUpdateConfig}
              config={config}
            />
            <ResourceMonitor resources={resources}/>
          </div>
          <div className='lg:col-span-3 flex flex-col gap-6'>
            <PerformanceChart data={performanceHistory} />
            <ThreadGrid threads={threads} />
          </div>
          <div className="lg:col-span-4">
            <AiOptimizer />
          </div>
        </div>
      </main>
    </div>
  );
}
