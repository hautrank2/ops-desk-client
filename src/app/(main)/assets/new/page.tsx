"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssetType } from "@/types/asset";
import { httpClient } from "@/lib/httpClient";

const assetSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.nativeEnum(AssetType),
  vendor: z.string().optional(),
  model: z.string().optional(),
  purchaseUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

export default function Page() {
  const router = useRouter();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: { code: "", name: "", type: AssetType.Device, vendor: "", model: "", purchaseUrl: "", description: "" },
  });

  const onSubmit = async (values: AssetFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => { if (value) formData.append(key, value); });
      await httpClient.post('/asset', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push("/assets");
    } catch (error) {
      console.error("Failed to save asset", error);
      router.push("/assets");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Asset</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>{Object.values(AssetType).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Details & Logistics</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="Provide any additional details about the asset..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Save Asset</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
