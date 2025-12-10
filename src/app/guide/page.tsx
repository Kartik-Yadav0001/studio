
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
    <main className="flex-1 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-3xl">
              <BookOpen className="h-8 w-8 text-primary" />
              <span>Thread Weaver Guide</span>
            </CardTitle>
            <CardDescription>
              An overview of the concepts and components of the thread pool simulator and admin dashboard.
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
               <AccordionItem value="item-5">
                <AccordionTrigger className="text-lg font-semibold">Admin: Auth User Management</AccordionTrigger>
                <AccordionContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                   <p>The Auth Admin page provides a centralized dashboard for managing all Firebase Authentication users. To access this page, you must be designated as an administrator.</p>
                  <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Statistics:</strong> View key metrics at a glance, including total users, enabled vs. disabled accounts, and the number of users with special permissions (custom claims).</li>
                      <li><strong>User Table:</strong> A comprehensive table of all registered users. You can search for specific users by their email, UID, or phone number, and filter the list by their account status.</li>
                      <li><strong>User Actions:</strong> For each user, you can perform administrative actions such as enabling or disabling their account, sending a password reset email, or editing their custom claims to grant or revoke specific permissions.</li>
                      <li><strong>Bulk Operations:</strong> The ability to import and export user data as a CSV file for offline analysis or bulk updates.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-lg font-semibold">Admin: Functions & Logs</AccordionTrigger>
                <AccordionContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                   <p>This page gives you visibility into your backend Cloud Functions and their logs. Note that this is a placeholder UI that simulates a real production environment.</p>
                  <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Deployed Functions:</strong> A list of all backend functions, showing their name, type (e.g., Flow, Callable), region, and runtime. From here, you can invoke callable functions to trigger server-side actions.</li>
                      <li><strong>Logs Explorer:</strong> A powerful tool for inspecting server-side logs. You can search for specific log messages and apply filters based on a date range, log level (e.g., ERROR, INFO), or function name.</li>
                      <li><strong>Saved Filters:</strong> To streamline debugging, you can save complex filter combinations as presets. This allows you to quickly access common queries, such as "Critical errors in the last 24 hours."</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="item-7">
                <AccordionTrigger className="text-lg font-semibold">Admin: Emulator Control Panel</AccordionTrigger>
                <AccordionContent className="space-y-4 text-base leading-relaxed text-muted-foreground">
                   <p>The Emulator Control Panel is your command center for managing the local Firebase development environment. It provides a user-friendly interface for tasks that would otherwise require command-line tools.</p>
                  <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Emulator Management:</strong> Start and stop the individual emulators (Auth, Firestore, Functions) and see their status at a glance. You can also open the official Firebase Emulator UI for more detailed inspection.</li>
                      <li><strong>Firestore Data:</strong> For the Firestore emulator, you can quickly clear all data to start fresh, or seed the database with a predefined set of test data.</li>
                      <li><strong>Data Snapshots:</strong> This powerful feature allows you to save the entire state of your Firestore emulator to a file (export) and later restore it (import). This is incredibly useful for creating consistent test environments and debugging complex data-related issues.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
