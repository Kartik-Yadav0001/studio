'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Upload } from 'lucide-react';
import type { UserProfile } from '@/lib/types';

interface AdminControlsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    users: UserProfile[];
}

export function AdminControls({ 
    searchQuery, 
    setSearchQuery, 
    statusFilter, 
    setStatusFilter, 
    users 
}: AdminControlsProps) {

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "id,email,phoneNumber,isDisabled,customClaims\n"
            + users.map(u => 
                `${u.id},${u.email || ''},${u.phoneNumber || ''},${u.isDisabled},"${JSON.stringify(u.customClaims)}"`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "users.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportClick = () => {
        // This is a placeholder for a real file input dialog
        alert("Bulk import functionality would be implemented here, typically involving a file input and a server-side function to process the CSV.");
    }

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by email, UID, or phone..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={handleImportClick}>
            <Upload className="mr-2" />
            Import
        </Button>
        <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2" />
            Export
        </Button>
      </div>
    </div>
  );
}
