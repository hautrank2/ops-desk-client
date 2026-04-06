"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
import { useApp } from "@/contexts/AppContext";

const schema = z.object({
  quantity: z.number({ error: "Must be a number" }).int().min(1, "At least 1"),
  locationId: z.string().optional(),
  ownerDeptId: z.string().optional(),
});

export type AssetItemFormValues = z.infer<typeof schema>;

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMutation: UseMutationResult<any, Error, Record<string, unknown>>;
  onCancel: () => void;
};

export function AssetItemForm({ createMutation, onCancel }: Props) {
  const { locations, departments } = useApp();

  const form = useForm<AssetItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1, locationId: "", ownerDeptId: "" },
  });

  const onSubmit = (values: AssetItemFormValues) => {
    const body: Record<string, unknown> = { quantity: values.quantity };
    if (values.locationId) body.locationId = values.locationId;
    if (values.ownerDeptId) body.ownerDeptId = values.ownerDeptId;
    createMutation.mutate(body, {
      onSuccess: () => form.reset({ quantity: 1, locationId: "", ownerDeptId: "" }),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location <span className="text-muted-foreground">(optional)</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl>
                <SelectContent>
                  {locations.map((l) => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ownerDeptId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner Department <span className="text-muted-foreground">(optional)</span></FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                <SelectContent>
                  {departments.map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Items
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
