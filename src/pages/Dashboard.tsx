"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Ticket, Building2, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function Dashboard() {
  const stats = [
    { title: "Total Assets", value: "1,284", icon: Package, color: "text-primary" },
    { title: "Active Tickets", value: "42", icon: Ticket, color: "text-orange-500" },
    { title: "Departments", value: "12", icon: Building2, color: "text-blue-500" },
    { title: "Staff Members", value: "86", icon: Users, color: "text-green-500" },
  ];

  const recentTickets = [
    { id: "1", title: "AC Repair - Floor 2", status: "Doing", priority: "High", time: "2h ago" },
    { id: "2", title: "Printer Setup - HR", status: "New", priority: "Medium", time: "4h ago" },
    { id: "3", title: "Network Issue - Server Room", status: "Waiting", priority: "Urgent", time: "5h ago" },
    { id: "4", title: "Light Replacement", status: "Done", priority: "Low", time: "1d ago" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{ticket.title}</p>
                    <p className="text-sm text-muted-foreground">{ticket.time}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      ticket.priority === 'Urgent' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {ticket.priority}
                    </span>
                    <span className="text-xs text-muted-foreground">{ticket.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">API Gateway</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Database Cluster</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Background Jobs</p>
                <p className="text-xs text-muted-foreground">Processing delay (2m)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Storage Service</p>
                <p className="text-xs text-muted-foreground">Maintenance scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
