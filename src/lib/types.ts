export type ThreadStatus = 'idle' | 'running' | 'waiting';

export interface Thread {
  id: number;
  status: ThreadStatus;
  currentTaskId: number | null;
  progress: number;
}

export interface Task {
  id: number;
  duration: number;
  remaining: number;
  resourceId: string | null;
}

export interface Resource {
  id: string;
  lockedByThreadId: number | null;
  queue: number[];
}

export interface PerformanceDataPoint {
  name: string;
  cpuUsage: number;
  memoryUsage: number;
  completedTasks: number;
}
