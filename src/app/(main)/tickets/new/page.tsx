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
import { TicketPriority, TicketType, TicketStatus } from "@/types/ticket";
import { httpClient } from "@/lib/httpClient";

const ticketSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  type: z.nativeEnum(TicketType),
  priority: z.nativeEnum(TicketPriority),
  status: z.nativeEnum(TicketStatus),
  description: z.string().optional(),
  cause: z.string().optional(),
  note: z.string().optional(),
});

type TicketFormValues = z.infer<typeof ticketSchema>;

export default function Page() {
  const router = useRouter();

  const form = useForm<TicketFormValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues: { code: "", title: "", type: TicketType.Repair, priority: TicketPriority.Medium, status: TicketStatus.New, description: "", cause: "", note: "" },
  });

  const onSubmit = async (values: TicketFormValues) => {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => { if (value) formData.append(key, value); });
      await httpClient.post('/ticket', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      router.push("/tickets");
    } catch (error) {
      console.error("Failed to create ticket", error);
      router.push("/tickets");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Ticket</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Ticket Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Ticket Code</FormLabel><FormControl><Input placeholder="TKT-001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g. AC leaking in Room 302" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>{Object.values(TicketType).map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="priority" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                        <SelectContent>{Object.values(TicketPriority).map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>{Object.values(TicketStatus).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Analysis & Notes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name="cause" render={({ field }) => (
                  <FormItem><FormLabel>Root Cause</FormLabel><FormControl><Input placeholder="e.g. Blocked drainage pipe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="note" render={({ field }) => (
                  <FormItem><FormLabel>Internal Note</FormLabel><FormControl><Textarea placeholder="Any internal notes..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader><CardTitle>Description</CardTitle></CardHeader>
              <CardContent>
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormControl><Textarea placeholder="Detailed description of the issue..." className="min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit"><Save className="mr-2 h-4 w-4" /> Create Ticket</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
