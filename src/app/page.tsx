'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/layout/header';
import { AiOptimizer } from '@/components/dashboard/ai-optimizer';
import { Controls } from '@/components/dashboard/controls';
import { PerformanceChart } from '@/components/dashboard/performance-chart';
import { ResourceMonitor } from '@/components/dashboard/resource-monitor';
import { ThreadGrid } from '@/components/dashboard/thread-grid';
import { TaskLog } from '@/components/dashboard/task-log';
import type { PerformanceDataPoint, Resource, Task, Thread, LogEntry, TaskPriority } from '@/lib/types';

export type SimulationStatus = 'running' | 'paused' | 'stopped';

type PriorityDistribution = {
  High: number;
  Medium: number;
  Low: number;
}

export type SimulationConfig = {
  threadCount: number;
  taskCount: number;
  resourceCount: number;
  simulationSpeed: number;
  priorityDistribution: PriorityDistribution;
};

const MAX_HISTORY = 30;
const MAX_LOGS = 50;

export default function Home() {
  const [config, setConfig] = useState<SimulationConfig>({
    threadCount: 100,
    taskCount: 200,
    resourceCount: 4,
    simulationSpeed: 250,
    priorityDistribution: { High: 15, Medium: 60, Low: 25 },
  });
  
  const [status, setStatus] = useState<SimulationStatus>('stopped');
  const [threads, setThreads] = useState<Thread[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceDataPoint[]>([]);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const logIdCounterRef = useRef(0);

  const simulationStateRef = useRef({ threads, tasks, resources, completedTasksCount });
  useEffect(() => {
    simulationStateRef.current = { threads, tasks, resources, completedTasksCount };
  }, [threads, tasks, resources, completedTasksCount]);
  
  const isInitialRender = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const threadIdCounterRef = useRef(config.threadCount);
  
  const addLog = useCallback((message: string, type: LogEntry['type']) => {
    setLog(prevLog => {
      const newEntry: LogEntry = {
        id: logIdCounterRef.current++,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
        message,
        type,
      };
      return [newEntry, ...prevLog].slice(0, MAX_LOGS);
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setStatus('stopped');
    
    const newThreads = Array.from({ length: config.threadCount }, (_, i) => ({
      id: i + 1,
      status: 'idle' as const,
      currentTaskId: null,
      progress: 0,
    }));
    threadIdCounterRef.current = config.threadCount;

    const newResources = Array.from({ length: config.resourceCount }, (_, i) => ({
      id: `Resource ${String.fromCharCode(65 + i)}`,
      lockedByThreadId: null,
      queue: [],
    }));

    const getPriority = (): TaskPriority => {
        const rand = Math.random() * 100;
        const { High, Medium } = config.priorityDistribution;
        if (rand < High) return 'High';
        if (rand < High + Medium) return 'Medium';
        return 'Low';
    }

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
            priority: getPriority(),
        }
    });

    setThreads(newThreads);
    setResources(newResources);
    setTasks(newTasks);
    setPerformanceHistory([]);
    setCompletedTasksCount(0);
    setLog([]);
    logIdCounterRef.current = 0;
    addLog('Simulation reset and initialized.', 'info');
  }, [config.threadCount, config.taskCount, config.resourceCount, config.priorityDistribution, addLog]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      resetSimulation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scaleThreads = useCallback((newThreadCount: number) => {
    setThreads(prevThreads => {
      const currentCount = prevThreads.length;
      if (newThreadCount > currentCount) {
        // Add new threads
        const newThreads = Array.from({ length: newThreadCount - currentCount }, () => ({
          id: ++threadIdCounterRef.current,
          status: 'idle' as const,
          currentTaskId: null,
          progress: 0,
        }));
        addLog(`Scaled up to ${newThreadCount} threads.`, 'info');
        return [...prevThreads, ...newThreads];
      } else if (newThreadCount < currentCount) {
        // Mark threads for termination
        let threadsToTerminate = currentCount - newThreadCount;
        const newThreads = [...prevThreads];
        
        // Prioritize terminating idle threads
        for (let i = newThreads.length - 1; i >= 0 && threadsToTerminate > 0; i--) {
          if (newThreads[i].status === 'idle') {
            newThreads.splice(i, 1);
            threadsToTerminate--;
          }
        }
        
        // If more threads need to be terminated, mark busy ones
        for (let i = newThreads.length - 1; i >= 0 && threadsToTerminate > 0; i--) {
          if (newThreads[i].status !== 'terminating') {
            newThreads[i].status = 'terminating';
            threadsToTerminate--;
          }
        }
        addLog(`Scaling down to ${newThreadCount} threads.`, 'warning');
        return newThreads;
      }
      return prevThreads;
    });
  }, [addLog]);

  const runSimulationTick = useCallback(() => {
    let { threads: currentThreads, tasks: currentTasks, resources: currentResources } = simulationStateRef.current;
    
    let newThreads = JSON.parse(JSON.stringify(currentThreads)) as Thread[];
    let newTasks = JSON.parse(JSON.stringify(currentTasks)) as Task[];
    let newResources = JSON.parse(JSON.stringify(currentResources)) as Resource[];
    let completedInTick = 0;
    
    let threadsToRemove: number[] = [];

    newThreads.forEach((thread) => {
      if (thread.status === 'running' && thread.currentTaskId !== null) {
        const task = newTasks.find((t) => t.id === thread.currentTaskId);
        if (task) {
          task.remaining--;
          thread.progress = 100 * (1 - task.remaining / task.duration);
          if (task.remaining <= 0) {
            addLog(`Task ${task.id} (P: ${task.priority}) completed by Thread ${thread.id}.`, 'success');
            completedInTick++;
            
            if (thread.status === 'terminating') {
              threadsToRemove.push(thread.id);
              addLog(`Terminating Thread ${thread.id} after task completion.`, 'info');
            } else {
              thread.status = 'idle';
              thread.currentTaskId = null;
              thread.progress = 0;
            }
            
            if (task.resourceId) {
              const resource = newResources.find((r) => r.id === task.resourceId);
              if (resource && resource.lockedByThreadId === thread.id) {
                resource.lockedByThreadId = null;
                addLog(`Resource ${resource.id} released by Thread ${thread.id}.`, 'info');
              }
            }
          }
        }
      } else if (thread.status === 'idle' && thread.status === 'terminating') {
          threadsToRemove.push(thread.id);
      }
    });

    if(threadsToRemove.length > 0) {
        newThreads = newThreads.filter(t => !threadsToRemove.includes(t.id));
    }


    newResources.forEach((resource) => {
      if (resource.lockedByThreadId === null && resource.queue.length > 0) {
        const nextThreadId = resource.queue.shift();
        const thread = newThreads.find((t: Thread) => t.id === nextThreadId);
        if (thread && thread.status === 'waiting') {
          resource.lockedByThreadId = thread.id;
          thread.status = 'running';
          addLog(`Resource ${resource.id} locked by Thread ${thread.id} from queue.`, 'info');
        }
      }
    });

    const unassignedTasks = newTasks.filter((t) => t.remaining > 0 && !newThreads.some((th) => th.currentTaskId === t.id));
    unassignedTasks.sort((a, b) => {
        const priorityOrder: Record<TaskPriority, number> = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    let taskQueueIndex = 0;

    newThreads.forEach((thread) => {
      if (thread.status === 'idle' && taskQueueIndex < unassignedTasks.length) {
        const taskToAssign = unassignedTasks[taskQueueIndex++];
        thread.currentTaskId = taskToAssign.id;
        addLog(`Thread ${thread.id} started Task ${taskToAssign.id} (P: ${taskToAssign.priority}).`, 'info');
        if (taskToAssign.resourceId) {
          const resource = newResources.find((r) => r.id === taskToAssign.resourceId);
          if (resource) {
            if (resource.lockedByThreadId === null) {
              resource.lockedByThreadId = thread.id;
              thread.status = 'running';
              addLog(`Resource ${resource.id} locked by Thread ${thread.id}.`, 'info');
            } else {
              thread.status = 'waiting';
              if (!resource.queue.includes(thread.id)) {
                resource.queue.push(thread.id);
                addLog(`Thread ${thread.id} is waiting for Resource ${resource.id}.`, 'warning');
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

    const runningThreads = newThreads.filter((t) => t.status === 'running').length;
    const totalThreads = newThreads.length;
    const cpuUsage = totalThreads > 0 ? (runningThreads / totalThreads) * 100 + Math.random() * 5 : 0;
    const activeTasks = newTasks.filter((t) => t.remaining > 0).length;
    const memoryUsage = (totalThreads * 0.1 + activeTasks * 0.02) * (1 + Math.random() * 0.1);

    setPerformanceHistory(prev => {
      const newPoint = {
        name: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        cpuUsage: Math.min(100, parseFloat(cpuUsage.toFixed(1))),
        memoryUsage: Math.min(100, parseFloat(memoryUsage.toFixed(1))),
        completedTasks: (prev.at(-1)?.completedTasks ?? 0) + completedInTick
      };
      return [...prev, newPoint].slice(-MAX_HISTORY);
    });

  }, [addLog]);

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

  const handleUpdateConfig = <K extends keyof SimulationConfig>(key: K, value: SimulationConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    if (key === 'threadCount') {
        scaleThreads(value as number);
    } else if (key !== 'simulationSpeed') {
        resetSimulation();
    }
  };
  
  // Effect to trigger reset when certain configs change
  useEffect(() => {
    if (!isInitialRender.current) {
        resetSimulation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.taskCount, config.resourceCount, config.priorityDistribution]);
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
          <div className='lg:col-span-1 xl:col-span-1 flex flex-col gap-6'>
            <Controls 
              status={status}
              onStart={() => setStatus('running')}
              onPause={() => setStatus('paused')}
              onStop={resetSimulation}
              onUpdateConfig={handleUpdateConfig}
              config={config}
            />
            <ResourceMonitor resources={resources}/>
          </div>
          <div className='lg:col-span-2 xl:col-span-2 flex flex-col gap-6'>
            <PerformanceChart data={performanceHistory} />
            <ThreadGrid threads={threads} tasks={tasks} />
          </div>
          <div className="lg:col-span-3 xl:col-span-1">
             <TaskLog log={log}/>
          </div>
          <div className="lg:col-span-3 xl:col-span-4">
             <AiOptimizer 
              performanceHistory={performanceHistory} 
              threads={threads}
              onApplyRecommendation={(threadCount: number) => {
                setConfig(prev => ({ ...prev, threadCount }));
                scaleThreads(threadCount);
              }}
             />
          </div>
        </div>
      </main>
    </div>
  );
}
