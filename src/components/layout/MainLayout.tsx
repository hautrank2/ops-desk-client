"use client";

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AppBreadcrumb } from './Breadcrumb';
import { ProtectedRoute } from '../auth/ProtectedRoute';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex h-[calc(100vh-3.5rem)]">
          <Sidebar className="hidden md:flex w-60 shrink-0 flex-col border-r" />
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 md:p-8 max-w-screen-2xl mx-auto space-y-6">
              <AppBreadcrumb />
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
