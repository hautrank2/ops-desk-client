"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetItemSection } from "@/components/assets/AssetItemSection";
import { AssetModel } from "@/types/asset";
import { httpClient } from "@/lib/httpClient";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: asset, isLoading } = useQuery<AssetModel>({
    queryKey: ["asset", id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/asset/${id}`);
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/assets")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">
                  {asset?.code} — Asset Items
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">{asset?.name}</p>
              </>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.push(`/assets/${id}`)}>
          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit Asset
        </Button>
      </div>

      <AssetItemSection assetId={id} />
    </div>
  );
}
