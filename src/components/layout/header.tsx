
'use client';

import Link from 'next/link';
import { Logo } from "@/components/icons";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useUser } from '@/firebase';
import { UserNav } from './user-nav';

export function Header() {
  const { user, isUserLoading } = useUser();

  const navLinks = [
    { href: '/', label: 'Simulation' },
    { href: '/guide', label: 'Guide' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Auth Admin' },
    { href: '/admin/functions', label: 'Functions & Logs' },
    { href: '/admin/emulators', label: 'Emulators' },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Thread Weaver</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-4 ml-6">
            {navLinks.map(link => (
              <Button variant="link" asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {user && adminLinks.map(link => (
               <Button variant="link" asChild key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            {isUserLoading ? null : user ? <UserNav user={user} /> : (
              <>
                <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                <Button asChild><Link href="/signup">Sign Up</Link></Button>
              </>
            )}
          </div>
           <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-4 text-lg font-medium mt-6">
                       {[...navLinks, ...(user ? adminLinks : [])].map(link => (
                         <Link key={link.href} href={link.href} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            {link.label}
                        </Link>
                       ))}
                       <div className="mt-6">
                         {isUserLoading ? null : user ? <UserNav user={user} /> : (
                          <div className="flex flex-col gap-4">
                            <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
                            <Button asChild><Link href="/signup">Sign Up</Link></Button>
                          </div>
                        )}
                       </div>
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
        </div>
    </header>
  );
}
