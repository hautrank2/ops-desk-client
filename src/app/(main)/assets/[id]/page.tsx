"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetInfoTab } from "@/components/assets/tabs/AssetInfoTab";
import { AssetImagesTab } from "@/components/assets/tabs/AssetImagesTab";
import { AssetItemsTab } from "@/components/assets/tabs/AssetItemsTab";
import { AssetModel } from "@/types/asset";
import { httpClient } from "@/lib/httpClient";

type Tab = "items" | "info" | "images";
const TABS: Tab[] = ["items", "info", "images"];

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab") as Tab | null;
  const activeTab: Tab = rawTab && TABS.includes(rawTab) ? rawTab : "items";

  const setTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.replace(`/assets/${id}?${params.toString()}`);
    },
    [id, router, searchParams]
  );

  const { data: asset, isLoading } = useQuery<AssetModel>({
    queryKey: ["asset", id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/asset/${id}`);
      return data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/assets")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <h1 className="text-2xl font-bold tracking-tight">{asset?.code}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{asset?.name}</p>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="images">
            Images
            {(asset?.imageUrls?.length ?? 0) > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/15 text-primary px-1.5 py-0.5 text-[10px] font-semibold">
                {asset?.imageUrls.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="mt-4">
          <AssetItemsTab assetId={id} />
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          {!isLoading && <AssetInfoTab asset={asset} />}
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          {asset && (
            <AssetImagesTab
              assetId={id}
              imageUrls={asset.imageUrls ?? []}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
