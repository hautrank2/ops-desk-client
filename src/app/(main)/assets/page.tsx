"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetModel, AssetType, TableResponse } from "@/types";
import { httpClient } from "@/lib/httpClient";

const PAGE_SIZE = 10;

export default function Page() {
  const router = useRouter();
  const [assets, setAssets] = useState<AssetModel[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { data } = await httpClient.get<TableResponse<AssetModel>>('/asset', {
          params: { page, pageSize: PAGE_SIZE, search: search || undefined },
        });
        setAssets(data.items || []);
        setTotalPage(data.totalPage ?? 1);
        setTotal(data.total ?? 0);
      } catch (error) {
        console.error("Failed to fetch assets", error);
        setAssets([
          { id: "1", code: "AST-001", name: "MacBook Pro M3", type: AssetType.IT, vendor: "Apple", model: "M3 Pro 14-inch", active: true, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: "2", code: "AST-002", name: 'Dell Monitor 27"', type: AssetType.IT, vendor: "Dell", model: "U2723QE", active: true, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          { id: "3", code: "AST-003", name: "Office Chair", type: AssetType.Furniture, vendor: "Herman Miller", model: "Aeron", active: true, images: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        ]);
        setTotalPage(1);
        setTotal(3);
      }
    };
    fetchAssets();
  }, [page, search]);

  const columns: ColumnDef<AssetModel>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <span className="font-mono font-semibold text-primary">{row.getValue("code")}</span>,
    },
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground border border-accent/50 px-2.5 py-0.5 text-xs font-medium">
          {row.getValue("type")}
        </span>
      ),
    },
    { accessorKey: "vendor", header: "Vendor" },
    { accessorKey: "model", header: "Model" },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => {
        const active = row.getValue("active");
        return active
          ? <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">Active</span>
          : <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 text-xs font-semibold">Inactive</span>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const asset = row.original as AssetModel;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" nativeButton={false} />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Link href={`/assets/${asset.id}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(asset.code)}>
                Copy Asset Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {asset.purchaseUrl && (
                <a href={asset.purchaseUrl} target="_blank" rel="noopener noreferrer">
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 h-4 w-4" /> View Purchase
                  </DropdownMenuItem>
                </a>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assets</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your organization's physical and digital assets.</p>
        </div>
        <Link href="/assets/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Asset
          </Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={assets}
        searchPlaceholder="Search assets..."
        onSearch={(v) => { setSearch(v); setPage(1); }}
        page={page}
        totalPage={totalPage}
        total={total}
        onPageChange={setPage}
        onRowClick={(asset) => router.push(`/assets/${asset.id}`)}
      />
    </div>
  );
}
