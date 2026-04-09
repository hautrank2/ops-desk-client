"use client";

import { AssetItemSection } from "@/components/assets/AssetItemSection";

type Props = {
  assetId: string;
};

export function AssetItemsTab({ assetId }: Props) {
  return <AssetItemSection assetId={assetId} />;
}
