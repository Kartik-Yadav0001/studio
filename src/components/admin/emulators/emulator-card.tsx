'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, ExternalLink, DatabaseZap, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { type Emulator } from './types';

interface EmulatorCardProps {
    emulator: Emulator;
}

export function EmulatorCard({ emulator }: EmulatorCardProps) {
    const [status, setStatus] = useState<'running' | 'stopped'>('stopped');
    const { toast } = useToast();
    const { name, port, uiPort, Icon, description } = emulator;
    
    const handleAction = (action: 'start' | 'stop' | 'seed' | 'clear') => {
        let title = '';
        let description = '';

        switch (action) {
            case 'start':
                setStatus('running');
                title = `${name} Emulator Started`;
                description = `The ${name} emulator is now running on port ${port}.`;
                break;
            case 'stop':
                setStatus('stopped');
                title = `${name} Emulator Stopped`;
                description = `The ${name} emulator has been shut down.`;
                break;
            case 'seed':
                title = 'Database Seeding';
                description = `Seeding Firestore with initial data... (placeholder)`;
                break;
            case 'clear':
                title = 'Database Cleared';
                description = 'All data in the Firestore emulator has been cleared. (placeholder)';
                break;
        }

        toast({ title, description });
    };

    const openUi = () => {
        if (!uiPort) return;
        window.open(`http://localhost:${uiPort}`, '_blank');
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <Icon className="h-8 w-8 text-primary" />
                        <div>
                            <CardTitle>{name}</CardTitle>
                            <CardDescription className="mt-1">{description}</CardDescription>
                        </div>
                    </div>
                    <Badge variant={status === 'running' ? 'default' : 'destructive'}>
                        {status === 'running' ? 'Running' : 'Stopped'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className='flex items-center justify-between text-sm p-3 bg-secondary/30 rounded-md'>
                    <span className="font-semibold">Service Port:</span>
                    <span className="font-mono text-muted-foreground">{port}</span>
                </div>
                 {uiPort > 0 && (
                    <div className='flex items-center justify-between text-sm p-3 bg-secondary/30 rounded-md'>
                        <span className="font-semibold">Emulator UI Port:</span>
                        <span className="font-mono text-muted-foreground">{uiPort}</span>
                    </div>
                )}
                {name === 'Firestore' && (
                     <div className="space-y-2">
                        <h4 className='text-sm font-semibold'>Data Management</h4>
                         <div className="flex w-full gap-2">
                            <Button onClick={() => handleAction('seed')} variant="secondary" className="flex-1" disabled={status === 'stopped'}>
                                <DatabaseZap /> Seed Data
                            </Button>
                            <Button onClick={() => handleAction('clear')} variant="destructive" className="flex-1" disabled={status === 'stopped'}>
                               <Trash2 /> Clear Data
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                {status === 'stopped' ? (
                    <Button onClick={() => handleAction('start')} className="flex-1">
                        <Play /> Start
                    </Button>
                ) : (
                    <Button onClick={() => handleAction('stop')} variant="outline" className="flex-1">
                        <Square /> Stop
                    </Button>
                )}
                {uiPort > 0 && (
                    <Button onClick={openUi} variant="secondary" disabled={status === 'stopped'} className="flex-1">
                        <ExternalLink /> Open UI
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}