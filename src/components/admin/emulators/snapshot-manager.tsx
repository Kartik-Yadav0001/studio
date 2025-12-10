'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, Server, HardDriveUpload, HardDriveDownload, Trash2 } from "lucide-react";
import { useState } from "react";

const placeholderSnapshots = [
    { id: 'snap-001', name: 'clean-slate', date: '2024-07-30T10:00:00Z', size: '2.1 KB' },
    { id: 'snap-002', name: 'after-user-seed', date: '2024-07-30T11:30:00Z', size: '15.8 KB' },
    { id: 'snap-003', name: 'complex-test-case', date: '2024-07-31T09:15:00Z', size: '88.2 KB' },
];

export function SnapshotManager() {
    const { toast } = useToast();
    const [snapshotName, setSnapshotName] = useState('');

    const handleAction = (action: 'import' | 'export') => {
         if (action === 'export' && !snapshotName) {
            toast({
                title: 'Export Failed',
                description: 'Please provide a name for the snapshot.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: `Placeholder Action: ${action === 'import' ? 'Import' : 'Export'}`,
            description: `This would trigger a script to ${action} the data ${action === 'export' ? `to a file named '${snapshotName}'` : 'from a selected file'}.`,
        });

        if(action === 'export') {
            setSnapshotName('');
        }
    }
    
    const handleLoadSnapshot = (name: string) => {
        toast({
            title: "Loading Snapshot",
            description: `Restoring Firestore data from snapshot: ${name}. (placeholder)`,
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Server /> Firestore Data Snapshots</CardTitle>
                <CardDescription>
                    Import and export the state of your Firestore emulator. Useful for creating consistent test datasets.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg">
                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold flex items-center gap-2"><HardDriveDownload /> Export Current State</h3>
                        <p className="text-sm text-muted-foreground">Save the current data in the Firestore emulator to a file.</p>
                        <div className="flex gap-2">
                            <Input 
                                placeholder="Snapshot name (e.g., 'user-test-data')" 
                                value={snapshotName}
                                onChange={(e) => setSnapshotName(e.target.value)}
                            />
                            <Button onClick={() => handleAction('export')}>
                                <Download className="mr-2"/> Export
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <h3 className="font-semibold flex items-center gap-2"><HardDriveUpload /> Import from Snapshot</h3>
                        <p className="text-sm text-muted-foreground">Clear the emulator and load data from an existing snapshot file.</p>
                         <Button onClick={() => handleAction('import')} variant="outline" className="w-full sm:w-auto">
                            <Upload className="mr-2"/> Import from File
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Available Snapshots</h3>
                     <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden sm:table-cell">Date Created</TableHead>
                                    <TableHead className="hidden md:table-cell">Size</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {placeholderSnapshots.map(snap => (
                                    <TableRow key={snap.id}>
                                        <TableCell className="font-mono font-medium">{snap.name}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{new Date(snap.date).toLocaleString()}</TableCell>
                                        <TableCell className="hidden md:table-cell">{snap.size}</TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="outline" size="sm" onClick={() => handleLoadSnapshot(snap.name)}>Load</Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}