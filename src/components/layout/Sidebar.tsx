"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Ticket, Users, Building2, Settings, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Package },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname() || "";

  return (
    <div className={cn("pb-12 border-r bg-card", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
            OpsDesk
          </h2>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                render={<Link href={item.href} />}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar className="h-full border-none" />
      </SheetContent>
    </Sheet>
  );
}
