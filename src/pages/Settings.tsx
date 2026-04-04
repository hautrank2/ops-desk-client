"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    const savedUrl = localStorage.getItem('API_BASE_URL') || "";
    setApiUrl(savedUrl);
  }, []);

  const handleSave = () => {
    localStorage.setItem('API_BASE_URL', apiUrl);
    // Trigger storage event for the same window
    window.dispatchEvent(new Event('storage'));
    alert("API URL saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Configure your application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Set the base URL for the OpsDesk API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              placeholder="https://api.example.com"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Default: {process.env.NEXT_PUBLIC_API_BASE_URL || "/api"}
            </p>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" /> Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
