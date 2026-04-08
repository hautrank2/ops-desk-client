"use client";

import { Plus, Pencil, Trash2, Loader2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterBar, DebouncedInput, FilterSelect } from "@/components/ui/filter-bar";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDepartments } from "./hook";

const STATUS_OPTIONS = [
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export function DepartmentList() {
  const {
    items, total, totalPage, isLoading,
    page, setPage,
    search, statusFilter,
    setParam, clearFilters, hasFilters,
    dialogOpen, setDialogOpen, editing,
    form, onSubmit, isPending,
    openCreate, openEdit, deleteMutation,
  } = useDepartments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage organizational departments.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Department
        </Button>
      </div>

      <FilterBar hasFilters={hasFilters} onClear={clearFilters}>
        <DebouncedInput
          label="Search"
          value={search}
          onChange={(v) => setParam("search", v)}
          placeholder="Code or name…"
          className="w-48"
          icon
        />
        <FilterSelect
          label="Status"
          value={statusFilter}
          onChange={(v) => setParam("isActive", v)}
          placeholder="All status"
          options={STATUS_OPTIONS}
          className="w-32"
        />
        <span className="text-sm text-muted-foreground ml-auto self-end pb-0.5">{total} total</span>
      </FilterBar>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Code</TableHead>
              <TableHead className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Description</TableHead>
              <TableHead className="text-xs uppercase tracking-wide font-semibold text-muted-foreground">Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No departments found.</TableCell>
              </TableRow>
            ) : items.map((dept) => (
              <TableRow key={dept._id}>
                <TableCell className="font-mono font-semibold text-primary">{dept.code}</TableCell>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{dept.description ?? "—"}</TableCell>
                <TableCell>
                  {dept.isActive
                    ? <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">Active</span>
                    : <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">Inactive</span>
                  }
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(dept)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteMutation.mutate(dept._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPage > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <span className="text-sm text-muted-foreground">Page {page} / {totalPage}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPage} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Department" : "New Department"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="code" render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="IT" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="IT Department" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel>
                  <FormControl><Input placeholder="Brief description..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="isActive" render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel className="cursor-pointer">Active</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )} />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
