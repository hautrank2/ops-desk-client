"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetInfoTab } from "@/components/assets/tabs/AssetInfoTab";

export default function Page() {
  const router = useRouter();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/assets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Asset</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Add a new asset to the system</p>
        </div>
      </div>
      <AssetInfoTab isCreate />
    </div>
  );
}
