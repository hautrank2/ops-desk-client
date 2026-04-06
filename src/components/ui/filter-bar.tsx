"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── Debounced text input ──────────────────────────────────────────────────────
type DebouncedInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  debounce?: number;
  className?: string;
  icon?: boolean;
};

export function DebouncedInput({
  value: externalValue,
  onChange,
  placeholder,
  debounce = 400,
  className,
  icon = false,
}: DebouncedInputProps) {
  const [local, setLocal] = useState(externalValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sync when external resets (e.g. clear all)
  useEffect(() => { setLocal(externalValue); }, [externalValue]);

  const handle = (v: string) => {
    setLocal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange(v), debounce);
  };

  return (
    <div className={cn("relative", className)}>
      {icon && <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />}
      <Input
        value={local}
        onChange={(e) => handle(e.target.value)}
        placeholder={placeholder}
        className={cn("h-8 text-sm", icon && "pl-8")}
      />
    </div>
  );
}

// ── Generic filter select ─────────────────────────────────────────────────────
type FilterSelectProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
  className?: string;
};

export function FilterSelect({ value, onChange, placeholder, options, className }: FilterSelectProps) {
  return (
    <Select value={value || "__all__"} onValueChange={(v) => onChange(v === "__all__" ? "" : v)}>
      <SelectTrigger className={cn("h-8 text-sm", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">{placeholder}</SelectItem>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ── Clear-all button ──────────────────────────────────────────────────────────
type FilterBarProps = {
  children: React.ReactNode;
  onClear?: () => void;
  hasFilters?: boolean;
};

export function FilterBar({ children, onClear, hasFilters }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {children}
      {hasFilters && onClear && (
        <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={onClear}>
          <X className="h-3 w-3 mr-1" /> Clear
        </Button>
      )}
    </div>
  );
}
