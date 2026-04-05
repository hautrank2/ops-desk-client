"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import { AssetItemModel } from "@/types/asset-item";
import { LocationModel } from "@/types/location";
import { DepartmentModel } from "@/types/department";

export const createItemSchema = z.object({
  quantity: z.coerce.number().min(1, "At least 1"),
  locationId: z.string().optional(),
  ownerDeptId: z.string().optional(),
});

export type CreateItemValues = z.infer<typeof createItemSchema>;

export interface AssetItemSectionProps {
  assetId: string;
}

export function useAssetItemSection({ assetId }: AssetItemSectionProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery<AssetItemModel[]>({
    queryKey: ["asset-items", assetId],
    queryFn: async () => {
      const { data } = await httpClient.get(`/asset/${assetId}/items`);
      return data;
    },
  });

  const { data: locations = [] } = useQuery<LocationModel[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data } = await httpClient.get("/locations");
      return data;
    },
    enabled: open,
  });

  const { data: departments = [] } = useQuery<DepartmentModel[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await httpClient.get("/department");
      return data;
    },
    enabled: open,
  });

  const form = useForm<CreateItemValues>({
    resolver: zodResolver(createItemSchema),
    defaultValues: { quantity: 1, locationId: "", ownerDeptId: "" },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateItemValues) => {
      const body: Record<string, unknown> = { quantity: values.quantity };
      if (values.locationId) body.locationId = values.locationId;
      if (values.ownerDeptId) body.ownerDeptId = values.ownerDeptId;
      const { data } = await httpClient.post(`/asset/${assetId}/items`, body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-items", assetId] });
      form.reset({ quantity: 1, locationId: "", ownerDeptId: "" });
      setOpen(false);
    },
  });

  return { items, isLoading, locations, departments, form, createMutation, open, setOpen };
}
