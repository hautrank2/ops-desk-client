"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Ticket, Users, Building2,
  Settings, Menu, ChevronLeft, MapPin, Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export const SIDEBAR_EXPANDED_W = 240;
export const SIDEBAR_COLLAPSED_W = 56;

type NavItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
};

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  {
    name: 'Assets', href: '/assets', icon: Package,
    children: [
      { name: 'Asset List', href: '/assets' },
      { name: 'Asset Items', href: '/assets/asset-item' },
    ],
  },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Locations', href: '/locations', icon: MapPin },
  { name: 'Departments', href: '/departments', icon: Building2 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
  className?: string;
};

export function Sidebar({ collapsed = false, onToggle, className }: SidebarProps) {
  const pathname = usePathname() || "";

  const isGroupActive = (item: NavItem) =>
    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

  return (
    <div
      className={cn("flex flex-col border-r bg-card overflow-hidden transition-all duration-200", className)}
      style={{ width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W }}
    >
      {/* Logo */}
      <div className={cn("flex items-center h-14 border-b shrink-0 px-3", collapsed ? "justify-center" : "gap-2 px-4")}>
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <span className="text-primary-foreground text-xs font-bold">O</span>
        </div>
        {!collapsed && <span className="font-bold text-base tracking-tight truncate">OpsDesk</span>}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = isGroupActive(item);

          if (item.children && !collapsed) {
            return (
              <div key={item.href}>
                {/* Parent row — not a link, just a label */}
                <div className={cn(
                  "flex items-center gap-3 w-full h-9 px-2.5 rounded-lg text-sm font-medium",
                  active ? "text-foreground" : "text-muted-foreground"
                )}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {/* Sub-items */}
                <div className="ml-7 mt-0.5 space-y-0.5">
                  {item.children.map((child) => {
                    const childActive = pathname === child.href ||
                      (child.href !== item.href && pathname.startsWith(child.href));
                    return (
                      <Link key={child.href} href={child.href} className="block">
                        <Button
                          variant={childActive ? "default" : "ghost"}
                          className="w-full h-8 justify-start text-xs px-2.5"
                        >
                          {child.name}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          // collapsed or no children — single icon button
          return (
            <Link key={item.href} href={item.href} className="block cursor-pointer" title={collapsed ? item.name : undefined}>
              <Button
                variant={active ? "default" : "ghost"}
                className={cn(
                  "w-full h-9 cursor-pointer transition-all",
                  collapsed ? "justify-center px-0" : "justify-start gap-3",
                  active && "shadow-sm"
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
      <SheetTrigger
        render={
          <button className="inline-flex cursor-pointer items-center justify-center rounded-lg h-8 w-8 text-sm font-medium transition-all hover:bg-muted hover:text-foreground md:hidden" />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-60">
        <Sidebar className="h-full border-none" />
      </SheetContent>
    </Sheet>
  );
}
