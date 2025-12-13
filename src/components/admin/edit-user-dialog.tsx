'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Trash } from 'lucide-react';

interface EditUserDialogProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

export function EditUserDialog({ user, isOpen, onClose }: EditUserDialogProps) {
  const [claims, setClaims] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const { toast } = useToast();
  const firestore = useFirestore();

  useEffect(() => {
    if (user.customClaims) {
      try {
        const parsedClaims = typeof user.customClaims === 'string' 
            ? JSON.parse(user.customClaims) 
            : user.customClaims;
        setClaims(parsedClaims);
      } catch {
        setClaims({});
      }
    } else {
        setClaims({});
    }
  }, [user]);

  const handleSave = async () => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.id);
    try {
      await updateDoc(userRef, { customClaims: JSON.stringify(claims) });
      toast({
        title: 'Custom claims updated',
        description: `Successfully updated claims for ${user.email}.`,
      });
      onClose();
    } catch (error: unknown) {
      toast({
        title: 'Error updating claims',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  };

  const handleAddClaim = () => {
    if (newKey && newValue) {
      setClaims(prev => ({ ...prev, [newKey]: newValue }));
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDeleteClaim = (key: string) => {
    setClaims(prev => {
        const newClaims = {...prev};
        delete newClaims[key];
        return newClaims;
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Custom Claims</DialogTitle>
          <DialogDescription>
            Manage custom claims for {user.email}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className='space-y-2'>
                <Label>Existing Claims</Label>
                <div className='space-y-2 rounded-md border p-2 min-h-[60px] bg-secondary/30'>
                    {Object.keys(claims).length > 0 ? Object.entries(claims).map(([key, value]) => (
                        <div key={key} className='flex items-center justify-between text-sm p-2 rounded-md bg-background'>
                            <div>
                                <span className='font-semibold'>{key}:</span> {String(value)}
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDeleteClaim(key)}>
                                <Trash className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    )) : <p className="text-xs text-muted-foreground text-center py-4">No custom claims set.</p>}
                </div>
            </div>
            <div className="space-y-2">
                <Label>Add New Claim</Label>
                <div className="flex gap-2">
                    <Input
                    placeholder="Key (e.g., 'role')"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    />
                    <Input
                    placeholder="Value (e.g., 'admin')"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    />
                    <Button onClick={handleAddClaim}>Add</Button>
                </div>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
