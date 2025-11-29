'use client';

import { useActionState } from 'react';
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
import { BrainCircuit } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

export function AiOptimizer() {
  const [state, formAction] = useActionState(getRecommendedThreads, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && state.message !== 'Success') {
      toast({
        title: 'Optimization Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="text-primary" />
          Intelligent Thread Count Optimizer
        </CardTitle>
        <CardDescription>
          Use GenAI to recommend the optimal thread count based on system metrics and application needs.
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="grid sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="historicalLoadData">Historical Load Data</Label>
            <Textarea
              id="historicalLoadData"
              name="historicalLoadData"
              placeholder="e.g., Average CPU usage 75% over the last 24h, with peaks at 95% during 2-4 PM."
              className="min-h-[100px]"
            />
            {state.errors?.historicalLoadData && <p className="text-sm font-medium text-destructive">{state.errors.historicalLoadData[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentUsageMetrics">Current Usage Metrics</Label>
            <Textarea
              id="currentUsageMetrics"
              name="currentUsageMetrics"
              placeholder="e.g., CPU: 85%, Memory: 60GB/128GB, I/O wait: 5%"
              className="min-h-[100px]"
            />
            {state.errors?.currentUsageMetrics && <p className="text-sm font-medium text-destructive">{state.errors.currentUsageMetrics[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="applicationNeeds">Application Needs</Label>
            <Textarea
              id="applicationNeeds"
              name="applicationNeeds"
              placeholder="e.g., Real-time data processing, low latency is critical. Primarily CPU-bound tasks."
              className="min-h-[100px]"
            />
            {state.errors?.applicationNeeds && <p className="text-sm font-medium text-destructive">{state.errors.applicationNeeds[0]}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <SubmitButton />
          {state.data && (
            <div className="text-left sm:text-right max-w-md bg-muted/50 p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Recommendation</p>
              <h3 className="text-4xl font-bold text-accent">{state.data.recommendedThreadCount} <span className="text-2xl font-medium text-muted-foreground">Threads</span></h3>
              <p className="mt-2 text-sm text-muted-foreground italic">
                <strong>Reasoning:</strong> {state.data.reasoning}
              </p>
            </div>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
