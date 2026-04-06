"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LocationModel, FloorType, CreateLocationDto } from "@/types/location";
import { TableResponse } from "@/types/api";
import { httpClient } from "@/lib/httpClient";
import { useApp } from "@/contexts/AppContext";
import { formatDate } from "@/lib/formatDate";

const FLOOR_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "B2", value: "B2" },
  { label: "B1", value: "B1" },
  { label: "G (Ground)", value: "G" },
  { label: "L1", value: "L1" },
  { label: "L2", value: "L2" },
  { label: "L3", value: "L3" },
  { label: "L4", value: "L4" },
  { label: "L5", value: "L5" },
];

const locationSchema = z.object({
  code: z.string().min(1, "Required"),
  name: z.string().min(1, "Required"),
  floor: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type LocationFormValues = z.infer<typeof locationSchema>;

const PAGE_SIZE = 10;

export function LocationsPage() {
  const queryClient = useQueryClient();
  const { refetchLocations } = useApp();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LocationModel | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LocationModel | null>(null);

  const { data, isLoading } = useQuery<TableResponse<LocationModel>>({
    queryKey: ["locations-page", page, search],
    queryFn: async () => {
      const { data } = await httpClient.get("/location", {
        params: { page, pageSize: PAGE_SIZE, name: search || undefined },
      });
      // handle both paginated and array responses
      if (Array.isArray(data)) return { items: data, page: 1, pageSize: PAGE_SIZE, total: data.length, totalPage: 1 };
      return data;
    },
  });

  const locations = data?.items ?? [];

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: { code: "", name: "", floor: "", description: "", isActive: true },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ code: "", name: "", floor: "", description: "", isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (loc: LocationModel) => {
    setEditing(loc);
    form.reset({
      code: loc.code,
      name: loc.name,
      floor: loc.floor ?? "",
      description: loc.description ?? "",
      isActive: loc.isActive,
    });
    setDialogOpen(true);
  };

  const saveMutation = useMutation({
    mutationFn: async (values: LocationFormValues) => {
      const body: CreateLocationDto = {
        code: values.code,
        name: values.name,
        floor: (values.floor as FloorType) || null,
        description: values.description,
        isActive: values.isActive,
      };
      if (editing) {
        const { data } = await httpClient.patch(`/location/${editing._id}`, body);
        return data;
      }
      const { data } = await httpClient.post("/location", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations-page"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      refetchLocations();
      setDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/location/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations-page"] });
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      refetchLocations();
      setDeleteTarget(null);
    },
  });

  const columns: ColumnDef<LocationModel>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono font-semibold text-primary">{row.getValue("code")}</span>,
    },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "floor",
      header: "Floor",
      cell: ({ row }) => row.getValue("floor") ?? <span className="text-muted-foreground">—</span>,
    },
    { accessorKey: "description", header: "Description", cell: ({ row }) => row.getValue("description") ?? <span className="text-muted-foreground">—</span> },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => row.getValue("isActive")
        ? <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">Active</span>
        : <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">Inactive</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm" title={row.getValue("createdAt")}>
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const loc = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={() => openEdit(loc)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={() => setDeleteTarget(loc)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Locations</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage physical locations and floors.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Location
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={locations}
        searchPlaceholder="Search by name..."
        onSearch={(v) => { setSearch(v); setPage(1); }}
        page={page}
        totalPage={data?.totalPage ?? 1}
        total={data?.total ?? 0}
        onPageChange={setPage}
      />

      {/* Create / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Location" : "Add Location"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="code" render={({ field }) => (
                  <FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="LOC-01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Room 101" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="floor" render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select floor" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {FLOOR_OPTIONS.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel><FormControl><Input placeholder="e.g. Server room on level 2" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="mb-0">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Location</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <span className="font-semibold text-foreground">{deleteTarget?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget._id)}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
