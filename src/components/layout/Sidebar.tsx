"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Ticket, Users, Building2, Settings, Menu, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const SIDEBAR_EXPANDED_W = 240;
export const SIDEBAR_COLLAPSED_W = 56;

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assets', href: '/assets', icon: Package },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps) {
  const pathname = usePathname() || "";

  return (
    <div
      className={cn("flex flex-col border-r bg-card overflow-hidden transition-all duration-200", className)}
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W }}
    >
      {/* Logo / App name */}
      <div className={cn("flex items-center h-14 border-b shrink-0 px-3", collapsed ? "justify-center" : "gap-2 px-4")}>
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-bold">O</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-base tracking-tight truncate">OpsDesk</span>
        )}
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} className="block cursor-pointer" title={collapsed ? item.name : undefined}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full h-9 cursor-pointer transition-all",
                  collapsed ? "justify-center px-0" : "justify-start gap-3",
                  isActive && "shadow-sm"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Collapse toggle */}
      <div className={cn("border-t p-2", collapsed ? "flex justify-center" : "flex justify-end")}>
        <button
          onClick={onToggle}
          className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", collapsed && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" nativeButton={false} />}>
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-60">
        <Sidebar className="h-full border-none" />
      </SheetContent>
    </Sheet>
  );
}
