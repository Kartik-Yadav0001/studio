'use client';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { PerformanceDataPoint } from '@/lib/types';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Activity } from 'lucide-react';

const chartConfig = {
  cpuUsage: {
    label: 'CPU',
    color: 'hsl(var(--primary))',
  },
  memoryUsage: {
    label: 'Memory',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Activity/>
                Real-time Performance
            </CardTitle>
            <CardDescription>
                Simulated CPU and memory usage over time.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{
                        left: -20,
                        right: 12,
                        top: 4,
                        bottom: 4
                    }}
                >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickCount={6}
                        unit="%"
                    />
                    <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                    <defs>
                        <linearGradient id="fillCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-cpuUsage)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-cpuUsage)" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="fillMemory" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-memoryUsage)" stopOpacity={0.7} />
                            <stop offset="95%" stopColor="var(--color-memoryUsage)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <Area
                        dataKey="cpuUsage"
                        type="natural"
                        fill="url(#fillCpu)"
                        stroke="var(--color-cpuUsage)"
                        stackId="a"
                        name="CPU Usage"
                    />
                    <Area
                        dataKey="memoryUsage"
                        type="natural"
                        fill="url(#fillMemory)"
                        stroke="var(--color-memoryUsage)"
                        stackId="b"
                        name="Memory Usage"
                    />
                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}
