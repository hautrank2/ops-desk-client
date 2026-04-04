"use client";

import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, MoreHorizontal, Pencil, Eye, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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
import { Ticket, TicketPriority, TicketStatus, TicketType } from "@/types";
import { ticketService } from "@/lib/api";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await ticketService.findAll({ page: 1, pageSize: 100 });
        setTickets(response.data || []);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
        // Mock data
        setTickets([
          {
            id: "1",
            code: "TKT-001",
            title: "AC leaking in Room 302",
            type: TicketType.Repair,
            priority: TicketPriority.High,
            status: TicketStatus.Doing,
            assetItemIds: ["1"],
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            code: "TKT-002",
            title: "Annual Server Maintenance",
            type: TicketType.Maintenance,
            priority: TicketPriority.Medium,
            status: TicketStatus.New,
            assetItemIds: ["2"],
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "3",
            code: "TKT-003",
            title: "Broken window in lobby",
            type: TicketType.Incident,
            priority: TicketPriority.Urgent,
            status: TicketStatus.Waiting,
            assetItemIds: ["3"],
            images: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div className="font-mono font-medium">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("type")}</Badge>,
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as TicketPriority;
        const variants: Record<TicketPriority, string> = {
          [TicketPriority.Low]: "bg-slate-100 text-slate-700",
          [TicketPriority.Medium]: "bg-blue-100 text-blue-700",
          [TicketPriority.High]: "bg-orange-100 text-orange-700",
          [TicketPriority.Urgent]: "bg-red-100 text-red-700",
        };
        return <Badge className={variants[priority]}>{priority}</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as TicketStatus;
        const variants: Record<TicketStatus, string> = {
          [TicketStatus.New]: "secondary",
          [TicketStatus.Assigned]: "outline",
          [TicketStatus.Doing]: "default",
          [TicketStatus.Waiting]: "outline",
          [TicketStatus.Done]: "default",
          [TicketStatus.Cancelled]: "destructive",
        };
        return <Badge variant={variants[status] as any}>{status}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={`/tickets/${ticket.id}`} />}>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/tickets/${ticket.id}/edit`} />}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <AlertTriangle className="mr-2 h-4 w-4" /> Cancel Ticket
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
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">Track and manage maintenance requests and repairs.</p>
        </div>
        <Button render={<Link href="/tickets/new" />}>
          <Plus className="mr-2 h-4 w-4" /> Create Ticket
        </Button>
      </div>

      <DataTable columns={columns} data={tickets} searchKey="title" searchPlaceholder="Filter tickets by title..." />
    </div>
  );
}
