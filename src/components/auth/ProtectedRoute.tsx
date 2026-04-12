"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { LOCAL_KEYS } from "@/constants/local";
import { httpClient } from "@/lib/httpClient";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LOCAL_KEYS.TOKEN);
    if (!token) {
      router.replace("/login");
      return;
    }

    httpClient.get<{ valid: boolean }>("/auth/valid-token")
      .then(({ data }) => {
        if (data?.valid) {
          setIsReady(true);
        } else {
          localStorage.removeItem(LOCAL_KEYS.TOKEN);
          router.replace("/login");
        }
      })
      .catch(() => {
        localStorage.removeItem(LOCAL_KEYS.TOKEN);
        router.replace("/login");
      });
  }, [router]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
