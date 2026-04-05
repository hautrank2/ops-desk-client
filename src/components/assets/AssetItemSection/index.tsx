"use client";

import { Plus, Loader2, MapPin, Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AssetItemStatus } from "@/types/asset-item";
import { AssetItemSectionProps, useAssetItemSection } from "./hook";

const statusStyles: Record<AssetItemStatus, string> = {
  [AssetItemStatus.Available]: "bg-emerald-100 text-emerald-700 border-emerald-200",
  [AssetItemStatus.InUse]: "bg-blue-100 text-blue-700 border-blue-200",
  [AssetItemStatus.UnderMaintenance]: "bg-amber-100 text-amber-700 border-amber-200",
  [AssetItemStatus.Retired]: "bg-slate-100 text-slate-500 border-slate-200",
};

export function AssetItemSection(props: AssetItemSectionProps) {
  const { items, isLoading, locations, departments, form, createMutation, open, setOpen } =
    useAssetItemSection(props);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Asset Items</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Items
        </Button>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Package className="h-8 w-8 opacity-30" />
            <p className="text-sm">No items yet. Add some items to track.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => {
              const location = typeof item.location === "object" ? item.location : null;
              const dept = typeof item.ownerDept === "object" ? item.ownerDept : null;
              return (
                <div key={item._id} className="flex items-center gap-4 py-3">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">
                        {item._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyles[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {location.name}
                        </span>
                      )}
                      {dept && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {dept.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset Items</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => createMutation.mutate(v))} className="space-y-4">
              <FormField control={form.control} name="quantity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl><Input type="number" min={1} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="locationId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Location <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {locations.map((l) => <SelectItem key={l._id} value={l._id}>{l.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="ownerDeptId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Department <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d._id} value={d._id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Items
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
