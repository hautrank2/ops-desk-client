import { Construction } from "lucide-react";

export function PageDevelop({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-muted-foreground">
      <Construction className="h-12 w-12 opacity-40" />
      <div className="text-center">
        <p className="text-lg font-semibold">{title ?? "Under Development"}</p>
        <p className="text-sm mt-1">This page is coming soon.</p>
      </div>
    </div>
  );
}
