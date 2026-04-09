"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
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
  status: z.enum(Object.values(ItemStatus) as [string, ...string[]]),
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

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EditValues>({
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

  useEffect(() => {
    reset({
      code: item.code ?? "",
      serialNumber: item.serialNumber ?? "",
      status: item.status,
      locationId: item.locationId ?? "",
      owerId: item.owerId ?? "",
      note: item.note ?? "",
    });
  }, [item, reset]);

  const onSubmit = (values: EditValues) => {
    const dto: UpdateAssetItemDto = {};
    if (values.code !== undefined) dto.code = values.code || undefined;
    if (values.serialNumber !== undefined) dto.serialNumber = values.serialNumber || undefined;
    dto.status = values.status as ItemStatus;
    dto.locationId = values.locationId || undefined;
    dto.owerId = values.owerId || undefined;
    dto.note = values.note || undefined;
    updateMutation.mutate({ id: item._id, dto });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.code || undefined}>
          <FieldLabel>Code</FieldLabel>
          <Controller control={control} name="code" render={({ field }) => (
            <Input placeholder="Auto" aria-invalid={!!errors.code} {...field} />
          )} />
          <FieldError errors={[errors.code]} />
        </Field>

        <Field data-invalid={!!errors.serialNumber || undefined}>
          <FieldLabel>Serial No.</FieldLabel>
          <Controller control={control} name="serialNumber" render={({ field }) => (
            <Input placeholder="SN-..." aria-invalid={!!errors.serialNumber} {...field} />
          )} />
          <FieldError errors={[errors.serialNumber]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.status || undefined}>
          <FieldLabel>Status</FieldLabel>
          <Controller control={control} name="status" render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger aria-invalid={!!errors.status}><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(ItemStatus).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          <FieldError errors={[errors.status]} />
        </Field>

        <Field data-invalid={!!errors.locationId || undefined}>
          <FieldLabel>Location</FieldLabel>
          <Controller control={control} name="locationId" render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              items={[{ value: "", label: "None" }, ...locations.map((l) => ({ value: l._id, label: l.name }))]}
            >
              <SelectTrigger aria-invalid={!!errors.locationId}>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {locations.map((l) => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
              </SelectContent>
            </Select>
          )} />
          <FieldError errors={[errors.locationId]} />
        </Field>
      </div>

      <Field data-invalid={!!errors.note || undefined}>
        <FieldLabel>Note</FieldLabel>
        <Controller control={control} name="note" render={({ field }) => (
          <Textarea
            placeholder="Optional note..."
            className="resize-none"
            rows={2}
            aria-invalid={!!errors.note}
            {...field}
          />
        )} />
        <FieldError errors={[errors.note]} />
      </Field>

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
  );
}
