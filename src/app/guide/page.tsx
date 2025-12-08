import { Header } from '@/components/layout/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <BookOpen className="h-8 w-8 text-primary" />
                <span>Thread Weaver Guide</span>
              </CardTitle>
              <CardDescription>
                An overview of the concepts and components of the thread pool simulator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold">What is a Thread Pool?</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    A thread pool is a collection of pre-instantiated, idle threads that stand ready to be given work. Creating new threads is computationally expensive, so re-using existing threads can significantly improve performance and responsiveness, especially in applications that handle many short-lived tasks. This simulator helps visualize that process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-semibold">The Simulation Controls</AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                    <p>The control panel is the heart of the simulation, allowing you to configure the workload and environment:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Threads:</strong> Adjusts the total number of worker threads in the pool. More threads can handle more concurrent tasks, but also consume more memory and CPU for context switching.</li>
                      <li><strong>Tasks:</strong> Sets the total number of tasks to be processed.</li>
                      <li><strong>Shared Resources:</strong> Simulates a limited number of resources (like database connections or file handles) that threads might need to complete a task. This is used to demonstrate resource contention and locking.</li>
                      <li><strong>Task Priority:</strong> Controls the mix of High, Medium, and Low priority tasks. The simulator will prioritize tasks accordingly.</li>
                      <li><strong>Simulation Speed:</strong> Changes the duration of each "tick" of the simulation. A lower value speeds up the simulation.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-semibold">Understanding the Dashboard</AccordionTrigger>
                  <AccordionContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                     <p>The main dashboard provides a real-time view into the simulation's state:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>System Stats:</strong> High-level metrics showing remaining tasks, completed tasks, and throughput (tasks per second).</li>
                      <li><strong>Performance Chart:</strong> A graph showing simulated CPU Usage, Memory Usage, and Thread Utilization over time. This helps you see the impact of your configuration changes.</li>
                      <li><strong>Thread Grid:</strong> A visual representation of the entire thread pool. Each cell is a thread, colored by its status (Running, Waiting, Idle). You can hover over a thread to see details.</li>
                      <li><strong>Resource Monitor:</strong> Shows the status of shared resources. You can see which thread has locked a resource and which threads are waiting in a queue for it.</li>
                      <li><strong>Task Event Log:</strong> A live-scrolling log of every significant event in the simulation, from a thread starting a task to releasing a resource.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-semibold">The AI Performance Analyst</AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    The AI Analyst uses a generative model (Gemini) to provide intelligent recommendations. It analyzes the historical performance data and the current state of the thread pool to suggest an optimal thread count. Its reasoning is based on identifying patterns of under-utilization (too many idle threads) or over-subscription (too many threads waiting for resources), helping you find the sweet spot for your configured workload.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
