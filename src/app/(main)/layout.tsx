"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { AppProvider } from "@/contexts/AppContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <MainLayout>{children}</MainLayout>
    </AppProvider>
  );
}