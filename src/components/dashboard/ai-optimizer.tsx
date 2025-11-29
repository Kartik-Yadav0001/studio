'use client';

import { useActionState, useEffect, useMemo, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { getRecommendedThreads } from '@/app/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PerformanceDataPoint, Thread } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const initialState = {
  message: '',
  errors: null,
  data: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Analyzing...' : 'Optimize Threads'}
      <BrainCircuit className="ml-2" />
    </Button>
  );
}

interface AiOptimizerProps {
  performanceHistory: PerformanceDataPoint[];
  threads: Thread[];
  onApplyRecommendation: (threadCount: number) => void;
}

export function AiOptimizer({
  performanceHistory,
  threads,
  onApplyRecommendation,
}: AiOptimizerProps) {
  const [state, formAction] = useActionState(getRecommendedThreads, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const historicalDataString = useMemo(() => {
    if (performanceHistory.length === 0) return "No performance data yet. Run the simulation to gather data.";
    const cpuPoints = performanceHistory.map(p => p.cpuUsage);
    const memPoints = performanceHistory.map(p => p.memoryUsage);
    const avgCpu = cpuPoints.reduce((a, b) => a + b, 0) / cpuPoints.length;
    const maxCpu = Math.max(...cpuPoints);
    const avgMem = memPoints.reduce((a, b) => a + b, 0) / memPoints.length;
    const maxMem = Math.max(...memPoints);
    return `Historical performance over last ${performanceHistory.length} ticks:
- CPU Usage: Average ${avgCpu.toFixed(1)}%, Peak ${maxCpu.toFixed(1)}%.
- Memory Usage: Average ${avgMem.toFixed(1)}%, Peak ${maxMem.toFixed(1)}%.
- Tasks Completed: ${performanceHistory.at(-1)?.completedTasks ?? 0}.`;
  }, [performanceHistory]);

  const currentMetricsString = useMemo(() => {
    const runningThreads = threads.filter(t => t.status === 'running').length;
    const waitingThreads = threads.filter(t => t.status === 'waiting').length;
    const idleThreads = threads.filter(t => t.status === 'idle').length;
    return `Current snapshot:
- Total Threads: ${threads.length}.
- Running: ${runningThreads} (${((runningThreads / threads.length) * 100 || 0).toFixed(1)}%).
- Waiting for resources: ${waitingThreads} (${((waitingThreads / threads.length) * 100 || 0).toFixed(1)}%).
- Idle: ${idleThreads} (${((idleThreads / threads.length) * 100 || 0).toFixed(1)}%).
- Latest CPU: ${performanceHistory.at(-1)?.cpuUsage ?? 'N/A'}%
- Latest Memory: ${performanceHistory.at(-1)?.memoryUsage ?? 'N/A'}%`;
  }, [threads, performanceHistory]);


  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      toast({
        title: 'Optimization Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state.message, toast]);

  const handleApply = () => {
    if (state.data?.recommendedThreadCount) {
        onApplyRecommendation(state.data.recommendedThreadCount);
        toast({
            title: 'Recommendation Applied',
            description: `Thread count set to ${state.data.recommendedThreadCount}. The simulation has been reset.`,
        });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="text-primary" />
          Intelligent Thread Count Optimizer
        </CardTitle>
        <CardDescription>
          Use GenAI to recommend the optimal thread count based on live simulation data.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="grid sm:grid-cols-3 gap-6">
          <input type="hidden" name="historicalLoadData" value={historicalDataString} />
          <input type="hidden" name="currentUsageMetrics" value={currentMetricsString} />
          
          <div className="sm:col-span-3 space-y-2">
            <Label htmlFor="applicationNeeds">Application Needs</Label>
            <Textarea
              id="applicationNeeds"
              name="applicationNeeds"
              placeholder="e.g., Real-time data processing, low latency is critical. Primarily CPU-bound tasks."
              className="min-h-[100px]"
              defaultValue="This is a general purpose server handling mixed workloads, including I/O-bound and CPU-bound tasks. The goal is to maximize task throughput while maintaining reasonable resource utilization and responsiveness."
            />
            {state.errors?.applicationNeeds && <p className="text-sm font-medium text-destructive">{state.errors.applicationNeeds[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <SubmitButton />
          
            {state.data && (
                <Alert className="max-w-md">
                    <Cpu className="h-4 w-4" />
                    <AlertTitle>Optimization Recommendation</AlertTitle>
                    <AlertDescription className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">The AI recommends</p>
                            <p>
                                <span className="text-4xl font-bold text-accent">{state.data.recommendedThreadCount}</span>
                                <span className="text-2xl font-medium text-muted-foreground"> Threads</span>
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground italic">
                            <strong>Reasoning:</strong> {state.data.reasoning}
                        </p>
                        <Button onClick={handleApply} className="w-full">Apply Recommendation</Button>
                    </AlertDescription>
                </Alert>
            )}
        </CardFooter>
      </form>
    </Card>
  );
}
