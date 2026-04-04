"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace("/login");
    } else {
      setIsReady(true);
    }
  }, [router]);

  if (!isReady) return null;

  return <>{children}</>;
}
