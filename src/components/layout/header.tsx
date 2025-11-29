import { Logo } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
        <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">Thread Weaver</h1>
        </div>
        <div className="ml-auto">
            <Badge variant="outline">Simulation</Badge>
        </div>
    </header>
  );
}
