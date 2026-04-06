"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Loader2, Package, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssetItemModel, ItemStatus } from "@/types/asset-item";
import { useApp } from "@/contexts/AppContext";
import { formatDate } from "@/lib/formatDate";
import { UserCell } from "@/components/ui/user-cell";
import { AssetItemForm } from "./AssetItemForm";
import { AssetItemEditForm } from "./AssetItemEditForm";
import { type AssetItemSectionProps, useAssetItemSection } from "./hook";

const statusStyles: Record<ItemStatus, string> = {
  [ItemStatus.Available]: "bg-emerald-100 text-emerald-700 border-emerald-200",
  [ItemStatus.InUse]: "bg-blue-100 text-blue-700 border-blue-200",
  [ItemStatus.UnderMaintenance]: "bg-amber-100 text-amber-700 border-amber-200",
  [ItemStatus.Retired]: "bg-slate-100 text-slate-500 border-slate-200",
};

function LocationCell({ item }: { item: AssetItemModel }) {
  const { locationsMap } = useApp();
  const loc = (typeof item.location === "object" && item.location) ?? locationsMap[item.locationId ?? ""];
  return loc
    ? <span className="text-sm">{loc.name}</span>
    : <span className="text-muted-foreground">—</span>;
}

function buildColumns(onEdit: (item: AssetItemModel) => void): ColumnDef<AssetItemModel>[] {
  return [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.original.code ?? row.original._id.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "serialNumber",
      header: "Serial No.",
      cell: ({ row }) => row.original.serialNumber
        ? <span className="text-xs font-mono">{row.original.serialNumber}</span>
        : <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const s = row.original.status;
        return (
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusStyles[s]}`}>
            {s}
          </span>
        );
      },
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => <LocationCell item={row.original} />,
    },
    {
      id: "createdBy",
      header: "Created by",
      cell: ({ row }) => <UserCell user={row.original.createdBy} />,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-xs" title={row.getValue("createdAt")}>
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); onEdit(row.original); }}>
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ];
}

export function AssetItemSection(props: AssetItemSectionProps) {
  const {
    items, isLoading,
    createMutation, addOpen, setAddOpen,
    updateMutation, editItem, setEditItem,
    bulkStatusMutation,
  } = useAssetItemSection(props);

  const [selected, setSelected] = useState<AssetItemModel[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>("");

  const columns = buildColumns(setEditItem);

  const handleBulkApply = () => {
    if (!bulkStatus || selected.length === 0) return;
    bulkStatusMutation.mutate(
      { assetItemId: selected.map((i) => i._id), status: bulkStatus as ItemStatus },
      { onSuccess: () => { setSelected([]); setBulkStatus(""); } }
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base">Asset Items</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length} item{items.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Items
        </Button>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Bulk action bar — only visible when rows are selected */}
        {selected.length > 0 && (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2">
            <span className="text-xs text-muted-foreground shrink-0">
              {selected.length} selected
            </span>
            <Select value={bulkStatus} onValueChange={(v) => setBulkStatus(v as ItemStatus)}>
              <SelectTrigger className="h-7 w-44 text-xs">
                <SelectValue placeholder="Change status…" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ItemStatus).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-7 text-xs"
              disabled={!bulkStatus || bulkStatusMutation.isPending}
              onClick={handleBulkApply}
            >
              {bulkStatusMutation.isPending && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
              Apply
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs ml-auto"
              onClick={() => setSelected([])}
            >
              Clear
            </Button>
          </div>
        )}

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
          <DataTable
            columns={columns}
            data={items}
            enableRowSelection
            getRowId={(row) => row._id}
            onSelectionChange={setSelected}
          />
        )}
      </CardContent>

      {/* Add dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Asset Items</DialogTitle>
          </DialogHeader>
          <AssetItemForm createMutation={createMutation} onCancel={() => setAddOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item — {editItem?.code ?? editItem?._id.slice(-8).toUpperCase()}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <AssetItemEditForm
              item={editItem}
              updateMutation={updateMutation}
              onCancel={() => setEditItem(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
