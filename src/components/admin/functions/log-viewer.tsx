'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileText,
  Search,
  Calendar as CalendarIcon,
  ChevronDown,
  Filter,
  Bookmark,
  X,
  AlertCircle,
  Info,
  Terminal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import type { DateRange } from 'react-day-picker';

type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

const placeholderLogs = [
    { id: 1, timestamp: new Date(), level: 'INFO', functionName: 'processUserData', message: 'Function execution started for user: abc-123' },
    { id: 2, timestamp: new Date(Date.now() - 2000), level: 'DEBUG', functionName: 'processUserData', message: 'User data fetched from Firestore.' },
    { id: 3, timestamp: new Date(Date.now() - 4000), level: 'WARNING', functionName: 'processUserData', message: 'User custom claim "premium" is expired. Continuing as standard user.' },
    { id: 4, timestamp: new Date(Date.now() - 6000), level: 'INFO', functionName: 'processUserData', message: 'Function execution complete. Duration: 150ms' },
    { id: 5, timestamp: new Date(Date.now() - 10000), level: 'ERROR', functionName: 'dailyCleanup', message: 'Failed to connect to external API: Timeout after 5000ms.' },
    { id: 6, timestamp: new Date(Date.now() - 12000), level: 'INFO', functionName: 'dailyCleanup', message: 'Starting daily cleanup job.' },
    { id: 7, timestamp: new Date(Date.now() - 30000), level: 'INFO', functionName: 'intelligentThreadCountAdjustment', message: 'Flow invoked with current metrics.'},
    { id: 8, timestamp: new Date(Date.now() - 32000), level: 'DEBUG', functionName: 'intelligentThreadCountAdjustment', message: 'Recommendation: 120 threads. Reasoning: CPU is over-utilized.' },
    { id: 9, timestamp: new Date(Date.now() - 33000), level: 'INFO', functionName: 'intelligentThreadCountAdjustment', message: 'Flow completed successfully.'},
];

const logLevelConfig: Record<LogLevel, { icon: React.ElementType, color: string }> = {
    DEBUG: { icon: Terminal, color: 'text-gray-400' },
    INFO: { icon: Info, color: 'text-blue-400' },
    WARNING: { icon: AlertCircle, color: 'text-yellow-400' },
    ERROR: { icon: AlertCircle, color: 'text-red-500' },
};


export function LogViewer() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });
  const [logLevel, setLogLevel] = useState('all');
  const [functionFilter, setFunctionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [savedFilters, setSavedFilters] = useState<{name: string, query: string}[]>([
    { name: 'Critical Errors (24h)', query: 'level:ERROR' },
    { name: 'User Processing Warnings', query: 'function:processUserData level:WARNING' },
  ]);
  const [newFilterName, setNewFilterName] = useState('');


  const handleSaveFilter = () => {
    if(!searchQuery || !newFilterName) return;
    setSavedFilters(prev => [...prev, { name: newFilterName, query: searchQuery }]);
    setNewFilterName('');
  };

  const filteredLogs = placeholderLogs.filter(log => {
    const matchesDate = !date || (log.timestamp >= (date.from || -Infinity) && log.timestamp <= (date.to || Infinity));
    const matchesLevel = logLevel === 'all' || log.level === logLevel;
    const matchesFunction = functionFilter === 'all' || log.functionName === functionFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || log.functionName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesLevel && matchesFunction && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText />
          Logs Explorer
        </CardTitle>
        <CardDescription>
          Search, filter, and stream logs from your Cloud Functions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search logs... (e.g., 'error' or 'function:processUserData')"
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className='flex gap-2'>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                        date.to ? (
                            <>
                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(date.from, "LLL dd, y")
                        )
                        ) : (
                        <span>Pick a date</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
                 <Select value={logLevel} onValueChange={setLogLevel}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Log Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="DEBUG">Debug</SelectItem>
                        <SelectItem value="INFO">Info</SelectItem>
                        <SelectItem value="WARNING">Warning</SelectItem>
                        <SelectItem value="ERROR">Error</SelectItem>
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline">
                            <Filter className="mr-2" />
                            More Filters
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[220px] p-4 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Function Name</label>
                            <Select value={functionFilter} onValueChange={setFunctionFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select function" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Functions</SelectItem>
                                    <SelectItem value="intelligentThreadCountAdjustment">intelligentThreadCountAdjustment</SelectItem>
                                    <SelectItem value="processUserData">processUserData</SelectItem>
                                    <SelectItem value="dailyCleanup">dailyCleanup</SelectItem>
                                    <SelectItem value="generateReport">generateReport</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Saved Filters:</span>
            {savedFilters.map(filter => (
                <Badge 
                    key={filter.name} 
                    variant="secondary" 
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setSearchQuery(filter.query)}
                >
                    {filter.name}
                    <X className="ml-2 h-3 w-3" onClick={(e) => { e.stopPropagation(); setSavedFilters(p => p.filter(f => f.name !== filter.name))}} />
                </Badge>
            ))}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Bookmark className="mr-2" />
                        Save Current Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-4 space-y-2">
                    <Input placeholder="Filter name" value={newFilterName} onChange={e => setNewFilterName(e.target.value)} />
                    <Button onClick={handleSaveFilter} className="w-full">Save</Button>
                </PopoverContent>
            </Popover>
        </div>

        <div className="border rounded-md h-[500px] flex flex-col">
            <div className="p-2 border-b bg-secondary/30 text-sm font-semibold">
                Showing {filteredLogs.length} of {placeholderLogs.length} logs
            </div>
            <ScrollArea className="flex-grow">
                <div className="p-2 font-mono text-xs">
                    {filteredLogs.map(log => {
                        const config = logLevelConfig[log.level as LogLevel];
                        const Icon = config.icon;
                        return (
                            <div key={log.id} className="flex items-start gap-3 p-2 rounded hover:bg-secondary/50">
                                <Icon className={cn("h-4 w-4 mt-0.5 flex-shrink-0", config.color)} />
                                <div className="flex-grow">
                                    <p className="text-muted-foreground">
                                        {log.timestamp.toISOString()} [{log.functionName}] <span className={cn("font-bold", config.color)}>{log.level}</span>
                                    </p>
                                    <p className="text-foreground whitespace-pre-wrap">{log.message}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
