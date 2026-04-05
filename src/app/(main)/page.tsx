"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Ticket, Building2, Users, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export default function Page() {
  const stats = [
    { title: "Total Assets", value: "1,284", icon: Package, bg: "bg-violet-100 dark:bg-violet-900/30", color: "text-violet-600 dark:text-violet-400", trend: "+12 this month" },
    { title: "Active Tickets", value: "42", icon: Ticket, bg: "bg-amber-100 dark:bg-amber-900/30", color: "text-amber-600 dark:text-amber-400", trend: "8 urgent" },
    { title: "Departments", value: "12", icon: Building2, bg: "bg-sky-100 dark:bg-sky-900/30", color: "text-sky-600 dark:text-sky-400", trend: "2 new" },
    { title: "Staff Members", value: "86", icon: Users, bg: "bg-emerald-100 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400", trend: "+3 this week" },
  ];

  const recentTickets = [
    { id: "1", title: "AC Repair - Floor 2", status: "Doing", priority: "High", time: "2h ago" },
    { id: "2", title: "Printer Setup - HR", status: "New", priority: "Medium", time: "4h ago" },
    { id: "3", title: "Network Issue - Server Room", status: "Waiting", priority: "Urgent", time: "5h ago" },
    { id: "4", title: "Light Replacement", status: "Done", priority: "Low", time: "1d ago" },
  ];

  const priorityStyle: Record<string, string> = {
    Urgent: "bg-rose-100 text-rose-700 border-rose-200",
    High: "bg-amber-100 text-amber-700 border-amber-200",
    Medium: "bg-sky-100 text-sky-700 border-sky-200",
    Low: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const statusStyle: Record<string, string> = {
    New: "bg-slate-100 text-slate-600",
    Doing: "bg-violet-100 text-violet-700",
    Waiting: "bg-amber-100 text-amber-700",
    Done: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> {stat.trend}
                  </p>
                </div>
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Recent Tickets</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="flex items-center gap-3 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ticket.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{ticket.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyle[ticket.priority] || ""}`}>
                    {ticket.priority}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[ticket.status] || "bg-slate-100 text-slate-600"}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "API Gateway", status: "Operational", icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Database Cluster", status: "Operational", icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Background Jobs", status: "Processing delay (2m)", icon: Clock, color: "text-amber-500" },
              { label: "Storage Service", status: "Maintenance scheduled", icon: AlertCircle, color: "text-rose-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
                <item.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
