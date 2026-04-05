"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { AssetItemSection } from "@/components/assets/AssetItemSection";
import { AssetModel, AssetType } from "@/types/asset";
import { httpClient } from "@/lib/httpClient";

const assetSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["Device", "Appliance", "Furniture", "IT", "Facility"] as const),
  vendor: z.string().optional(),
  model: z.string().optional(),
  purchaseUrl: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AssetFormProps {
  id?: string;
}

export function AssetForm({ id }: AssetFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const { data: asset, isLoading } = useQuery<AssetModel>({
    queryKey: ["asset", id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/asset/${id}`);
      return data;
    },
    enabled: isEdit,
  });

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      code: "", name: "", type: AssetType.Device,
      vendor: "", model: "", purchaseUrl: "", description: "",
      images: [],
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        code: asset.code,
        name: asset.name,
        type: asset.type,
        vendor: asset.vendor ?? "",
        model: asset.model ?? "",
        purchaseUrl: asset.purchaseUrl ?? "",
        description: asset.description ?? "",
        images: [],
      });
    }
  }, [asset, form]);

  const buildFormData = (values: AssetFormValues) => {
    const fd = new FormData();
    fd.append("code", values.code);
    fd.append("name", values.name);
    fd.append("type", values.type);
    if (values.vendor) fd.append("vendor", values.vendor);
    if (values.model) fd.append("model", values.model);
    if (values.purchaseUrl) fd.append("purchaseUrl", values.purchaseUrl);
    if (values.description) fd.append("description", values.description);
    values.images?.forEach((file) => fd.append("images", file));
    return fd;
  };

  const createMutation = useMutation({
    mutationFn: async (values: AssetFormValues) => {
      const { data } = await httpClient.post("/asset", buildFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      router.push("/assets");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: AssetFormValues) => {
      const { data } = await httpClient.patch(`/asset/${id}`, buildFormData(values), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["asset", id] });
      router.push("/assets");
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: AssetFormValues) => {
    if (isEdit) updateMutation.mutate(values);
    else createMutation.mutate(values);
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isEdit ? "Edit Asset" : "New Asset"}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isEdit ? `Editing ${asset?.code}` : "Add a new asset to the system"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Asset Code</FormLabel><FormControl><Input placeholder="AST-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Asset Name</FormLabel><FormControl><Input placeholder="e.g. MacBook Pro" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent><SelectGroup>
                        {Object.values(AssetType).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectGroup></SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">Details & Logistics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="vendor" render={({ field }) => (
                  <FormItem><FormLabel>Vendor</FormLabel><FormControl><Input placeholder="e.g. Apple" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="model" render={({ field }) => (
                  <FormItem><FormLabel>Model</FormLabel><FormControl><Input placeholder="e.g. M3 Pro" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="purchaseUrl" render={({ field }) => (
                  <FormItem><FormLabel>Purchase URL</FormLabel><FormControl><Input placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="Additional details about the asset..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader><CardTitle className="text-base">Images</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="images" render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? []}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEdit ? "Update Asset" : "Save Asset"}
            </Button>
          </div>
        </form>
      </Form>

      {isEdit && id && <AssetItemSection assetId={id} />}
    </div>
  );
}
