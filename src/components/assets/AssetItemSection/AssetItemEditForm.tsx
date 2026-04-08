"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { ImageManager } from "@/components/ui/image-manager";
import { AssetItemModel, ItemStatus, UpdateAssetItemDto } from "@/types/asset-item";
import { useApp } from "@/contexts/AppContext";

const schema = z.object({
  code: z.string().optional(),
  serialNumber: z.string().optional(),
  status: z.nativeEnum(ItemStatus),
  locationId: z.string().optional(),
  owerId: z.string().optional(),
  note: z.string().optional(),
});

type EditValues = z.infer<typeof schema>;

type Props = {
  item: AssetItemModel;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMutation: UseMutationResult<any, Error, { id: string; dto: UpdateAssetItemDto }>;
  onCancel: () => void;
};

export function AssetItemEditForm({ item, updateMutation, onCancel }: Props) {
  const { locations } = useApp();

  const form = useForm<EditValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: item.code ?? "",
      serialNumber: item.serialNumber ?? "",
      status: item.status,
      locationId: item.locationId ?? "",
      owerId: item.owerId ?? "",
      note: item.note ?? "",
    },
  });

  // reset if item changes
  useEffect(() => {
    form.reset({
      code: item.code ?? "",
      serialNumber: item.serialNumber ?? "",
      status: item.status,
      locationId: item.locationId ?? "",
      owerId: item.owerId ?? "",
      note: item.note ?? "",
    });
  }, [item, form]);

  const onSubmit = (values: EditValues) => {
    const dto: UpdateAssetItemDto = {};
    if (values.code !== undefined) dto.code = values.code || undefined;
    if (values.serialNumber !== undefined) dto.serialNumber = values.serialNumber || undefined;
    dto.status = values.status;
    dto.locationId = values.locationId || undefined;
    dto.owerId = values.owerId || undefined;
    dto.note = values.note || undefined;
    updateMutation.mutate({ id: item._id, dto });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="code" render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl><Input placeholder="Auto" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="serialNumber" render={({ field }) => (
            <FormItem>
              <FormLabel>Serial No.</FormLabel>
              <FormControl><Input placeholder="SN-..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {Object.values(ItemStatus).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="locationId" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl><SelectTrigger><SelectValue placeholder="None" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {locations.map((l) => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField control={form.control} name="note" render={({ field }) => (
          <FormItem>
            <FormLabel>Note</FormLabel>
            <FormControl><Textarea placeholder="Optional note..." className="resize-none" rows={2} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Images */}
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Images</p>
          <ImageManager
            imageUrls={item.imageUrls ?? []}
            basePath={`/asset-item/${item._id}`}
            invalidateKeys={[["asset-items"]]}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
