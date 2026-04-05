"use client";

import { useParams } from "next/navigation";
import { AssetForm } from "@/components/assets/AssetForm";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <AssetForm id={id} />;
}
