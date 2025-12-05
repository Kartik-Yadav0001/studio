import Link from 'next/link';
import { Logo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Thread Weaver</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-4 ml-6">
            <Button variant="link" asChild>
                <Link href="/">Simulation</Link>
            </Button>
            <Button variant="link" asChild>
                <Link href="/admin">Auth Admin</Link>
            </Button>
            <Button variant="link" asChild>
                <Link href="/admin/functions">Functions & Logs</Link>
            </Button>
        </nav>
        <div className="ml-auto md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-4 text-lg font-medium mt-6">
                        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            Home
                        </Link>
                        <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                           Auth Admin
                        </Link>
                        <Link href="/admin/functions" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            Functions & Logs
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
        <div className="hidden md:flex ml-auto items-center">
            <Badge variant="outline" className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Admin
            </Badge>
        </div>
    </header>
  );
}
