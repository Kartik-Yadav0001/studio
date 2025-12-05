'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, PlayCircle, Rocket } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const placeholderFunctions = [
  { name: 'intelligentThreadCountAdjustment', region: 'us-central1', runtime: 'Node.js 20', lastDeployed: '2024-07-29T10:30:00Z', type: 'Flow' },
  { name: 'processUserData', region: 'us-east1', runtime: 'Python 3.11', lastDeployed: '2024-07-28T15:00:00Z', type: 'Callable' },
  { name: 'dailyCleanup', region: 'europe-west1', runtime: 'Node.js 20', lastDeployed: '2024-07-25T02:00:00Z', type: 'Scheduled' },
  { name: 'generateReport', region: 'us-central1', runtime: 'Go 1.22', lastDeployed: '2024-07-29T09:00:00Z', type: 'Callable' },
];

export function FunctionsList() {
    const { toast } = useToast();

    const handleInvoke = (functionName: string) => {
        toast({
            title: "Invoking Function",
            description: `Calling '${functionName}'... (This is a placeholder action)`,
        })
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket />
          Deployed Functions
        </CardTitle>
        <CardDescription>
          A list of all deployed Cloud Functions in your project.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Function Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden md:table-cell">Region</TableHead>
              <TableHead className="hidden lg:table-cell">Runtime</TableHead>
              <TableHead className="hidden sm:table-cell">Last Deployed</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placeholderFunctions.map((func) => (
              <TableRow key={func.name}>
                <TableCell>
                  <div className="font-medium">{func.name}</div>
                </TableCell>
                <TableCell>
                    <Badge variant="outline">{func.type}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{func.region}</TableCell>
                <TableCell className="hidden lg:table-cell">{func.runtime}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {new Date(func.lastDeployed).toLocaleString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {func.type === 'Callable' && (
                        <DropdownMenuItem onClick={() => handleInvoke(func.name)}>
                           <PlayCircle className="mr-2 h-4 w-4" />
                            Invoke
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>View Logs</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
