export type ThreadStatus = 'idle' | 'running' | 'waiting' | 'terminating';
export type TaskPriority = 'High' | 'Medium' | 'Low';

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
  priority: TaskPriority;
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

export interface LogEntry {
  id: number;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}
