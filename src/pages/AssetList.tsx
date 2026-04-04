"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Pencil, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Asset, AssetType } from "@/types";
import { assetService } from "@/lib/api";

export default function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await assetService.findAll({ page: 1, pageSize: 100 });
        setAssets(response.data || []);
      } catch (error) {
        console.error("Failed to fetch assets", error);
        // Mock data for demo if API fails
        setAssets([
          {
            id: "1",
            code: "AST-001",
            name: "MacBook Pro M3",
            type: AssetType.IT,
            vendor: "Apple",
            model: "M3 Pro 14-inch",
            active: true,
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            code: "AST-002",
            name: "Dell Monitor 27\"",
            type: AssetType.IT,
            vendor: "Dell",
            model: "U2723QE",
            active: true,
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            code: "AST-003",
            name: "Office Chair",
            type: AssetType.Furniture,
            vendor: "Herman Miller",
            model: "Aeron",
            active: true,
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  const columns: ColumnDef<Asset>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
    },
    {
      accessorKey: "model",
      header: "Model",
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.getValue("active") ? "default" : "secondary"}>
          {row.getValue("active") ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const asset = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={`/assets/${asset.id}`} />}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(asset.code)}>
                Copy Asset Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {asset.purchaseUrl && (
                <DropdownMenuItem render={<a href={asset.purchaseUrl} target="_blank" rel="noopener noreferrer" />}>
                  <ExternalLink className="mr-2 h-4 w-4" /> View Purchase
                </DropdownMenuItem>
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Manage your organization's physical and digital assets.</p>
        </div>
        <Button render={<Link href="/assets/new" />}>
          <Plus className="mr-2 h-4 w-4" /> Add Asset
        </Button>
      </div>

      <DataTable columns={columns} data={assets} searchKey="name" searchPlaceholder="Filter assets by name..." />
    </div>
  );
}
