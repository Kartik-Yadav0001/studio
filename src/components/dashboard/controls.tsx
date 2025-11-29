'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { SimulationStatus } from "@/app/page";
import { Pause, Play, SlidersHorizontal, Square } from "lucide-react";

interface ControlsProps {
  status: SimulationStatus;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onStep: () => void;
  onUpdateConfig: (key: 'threadCount' | 'taskCount' | 'resourceCount' | 'simulationSpeed', value: number) => void;
  config: {
    threadCount: number;
    taskCount: number;
    resourceCount: number;
    simulationSpeed: number;
  };
}

export function Controls({ status, onStart, onPause, onStop, onUpdateConfig, config }: ControlsProps) {
  const isRunning = status === 'running';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal />
            Simulation Controls
        </CardTitle>
        <CardDescription>Adjust workload parameters and control the simulation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="flex gap-2">
          {isRunning ? (
            <Button onClick={onPause} className="flex-1" aria-label="Pause simulation">
              <Pause className="mr-2" /> Pause
            </Button>
          ) : (
            <Button onClick={onStart} className="flex-1" aria-label="Start or resume simulation">
              <Play className="mr-2" /> {status === 'paused' ? 'Resume' : 'Start'}
            </Button>
          )}
          <Button onClick={onStop} variant="outline" className="flex-1" aria-label="Reset simulation">
            <Square className="mr-2" /> Reset
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-3">
              <Label htmlFor="threadCount">Threads ({config.threadCount})</Label>
              <Slider 
                  id="threadCount"
                  min={10} max={200} step={10} 
                  defaultValue={[config.threadCount]} 
                  onValueChange={([v]) => onUpdateConfig('threadCount', v)}
                  disabled={isRunning}
              />
          </div>
          <div className="space-y-3">
              <Label htmlFor="taskCount">Tasks ({config.taskCount})</Label>
              <Slider 
                  id="taskCount"
                  min={10} max={500} step={10} 
                  defaultValue={[config.taskCount]} 
                  onValueChange={([v]) => onUpdateConfig('taskCount', v)}
                  disabled={isRunning}
              />
          </div>
          <div className="space-y-3">
              <Label htmlFor="resourceCount">Shared Resources ({config.resourceCount})</Label>
              <Slider 
                  id="resourceCount"
                  min={0} max={10} step={1} 
                  defaultValue={[config.resourceCount]} 
                  onValueChange={([v]) => onUpdateConfig('resourceCount', v)}
                  disabled={isRunning}
              />
          </div>
          <div className="space-y-3">
              <Label htmlFor="simulationSpeed">Simulation Speed ({config.simulationSpeed}ms tick)</Label>
              <Slider 
                  id="simulationSpeed"
                  min={50} max={1000} step={50}
                  defaultValue={[config.simulationSpeed]} 
                  onValueChange={([v]) => onUpdateConfig('simulationSpeed', v)}
                  inverted
              />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
