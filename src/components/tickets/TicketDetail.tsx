"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Loader2, Calendar, User, MapPin, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TicketModel, TicketPriority, TicketStatus } from "@/types/ticket";
import { httpClient } from "@/lib/httpClient";
import { fileUrl } from "@/lib/fileUrl";
import { formatDate, formatDateFull } from "@/lib/formatDate";
import { UserCell } from "@/components/ui/user-cell";
import { useState } from "react";
import { X } from "lucide-react";

const priorityStyles: Record<TicketPriority, string> = {
  [TicketPriority.Low]: "bg-slate-100 text-slate-600 border-slate-200",
  [TicketPriority.Medium]: "bg-sky-100 text-sky-700 border-sky-200",
  [TicketPriority.High]: "bg-amber-100 text-amber-700 border-amber-200",
  [TicketPriority.Urgent]: "bg-rose-100 text-rose-700 border-rose-200",
};

const statusStyles: Record<TicketStatus, string> = {
  [TicketStatus.New]: "bg-slate-100 text-slate-600 border-slate-200",
  [TicketStatus.Assigned]: "bg-blue-100 text-blue-700 border-blue-200",
  [TicketStatus.Doing]: "bg-violet-100 text-violet-700 border-violet-200",
  [TicketStatus.Waiting]: "bg-amber-100 text-amber-700 border-amber-200",
  [TicketStatus.Done]: "bg-emerald-100 text-emerald-700 border-emerald-200",
  [TicketStatus.Cancelled]: "bg-red-100 text-red-600 border-red-200",
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="text-xs font-medium text-muted-foreground w-28 shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 text-sm">{children}</div>
    </div>
  );
}

export function TicketDetail({ id }: { id: string }) {
  const router = useRouter();
  const [previewing, setPreviewing] = useState<string | null>(null);

  const { data: ticket, isLoading } = useQuery<TicketModel>({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/ticket/${id}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2 text-muted-foreground">
        <AlertCircle className="h-8 w-8 opacity-40" />
        <p className="text-sm">Ticket not found.</p>
      </div>
    );
  }

  const imageUrls = ticket.imageUrls ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{ticket.code}</span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                {ticket.status}
              </span>
              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{ticket.title}</h1>
          </div>
        </div>
        <Link href={`/tickets/${id}/edit`}>
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main info */}
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="divide-y divide-border px-4 pb-2">
              <InfoRow label="Type">
                <span className="inline-flex items-center rounded-full bg-accent text-accent-foreground border border-accent/50 px-2.5 py-0.5 text-xs font-medium">
                  {ticket.type}
                </span>
              </InfoRow>
              <InfoRow label="Priority">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${priorityStyles[ticket.priority]}`}>
                  {ticket.priority}
                </span>
              </InfoRow>
              <InfoRow label="Status">
                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[ticket.status]}`}>
                  {ticket.status}
                </span>
              </InfoRow>
              {ticket.cause && (
                <InfoRow label="Root Cause">{ticket.cause}</InfoRow>
              )}
              {ticket.note && (
                <InfoRow label="Note">
                  <span className="text-muted-foreground">{ticket.note}</span>
                </InfoRow>
              )}
              {ticket.dueAt && (
                <InfoRow label="Due Date">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDateFull(ticket.dueAt)}
                  </span>
                </InfoRow>
              )}
              {ticket.closedAt && (
                <InfoRow label="Closed At">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDateFull(ticket.closedAt)}
                  </span>
                </InfoRow>
              )}
            </CardContent>
          </Card>

          {ticket.description && (
            <Card>
              <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Images */}
          {imageUrls.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Images <span className="text-muted-foreground font-normal text-xs ml-1">({imageUrls.length})</span></CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {imageUrls.map((path, i) => {
                    const url = fileUrl(path);
                    return (
                      <div
                        key={i}
                        className="aspect-square rounded-md overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setPreviewing(url)}
                      >
                        <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">People</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created by</p>
                <UserCell user={ticket.createdBy} />
              </div>
              {ticket.updatedBy && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last updated by</p>
                    <UserCell user={ticket.updatedBy} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Timestamps</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs">Created</span>
                <span className="text-xs" title={formatDateFull(ticket.createdAt)}>{formatDate(ticket.createdAt)}</span>
              </div>
              {ticket.updatedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-xs">Updated</span>
                  <span className="text-xs" title={formatDateFull(ticket.updatedAt)}>{formatDate(ticket.updatedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {ticket.assetItemIds?.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Asset Items</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {ticket.assetItemIds.map((itemId) => (
                    <div key={itemId} className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      {itemId.slice(-8).toUpperCase()}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {previewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setPreviewing(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setPreviewing(null)}
          >
            <X className="h-5 w-5" />
          </Button>
          <img
            src={previewing}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
