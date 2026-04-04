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
        <div className="flex">
          <Sidebar className="hidden md:block w-64 h-[calc(100vh-3.5rem)] sticky top-14" />
          <main className="flex-1 p-4 md:p-8 overflow-y-auto">
            <AppBreadcrumb />
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
