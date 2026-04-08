"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import { fileUrl } from "@/lib/fileUrl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ImageManagerProps {
  /** Relative image paths from server (e.g. "ops-desk/abc.jpg") */
  imageUrls: string[];
  /** API base path, e.g. "/asset/123" or "/ticket/456" */
  basePath: string;
  /** Query keys to invalidate after mutation */
  invalidateKeys?: unknown[][];
  className?: string;
}

export function ImageManager({ imageUrls, basePath, invalidateKeys = [], className }: ImageManagerProps) {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewing, setPreviewing] = useState<string | null>(null);

  const invalidate = () =>
    invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));

  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      const fd = new FormData();
      files.forEach((f) => fd.append("images", f));
      const { data } = await httpClient.post(`${basePath}/images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async (index: number) => {
      await httpClient.delete(`${basePath}/images/${index}`);
    },
    onSuccess: invalidate,
  });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    uploadMutation.mutate(Array.from(files));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Existing images grid */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {imageUrls.map((path, i) => {
            const url = fileUrl(path);
            return (
              <div key={i} className="relative group aspect-square rounded-md overflow-hidden border bg-muted">
                <img
                  src={url}
                  alt={`Image ${i + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setPreviewing(url)}
                />
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(i)}
                  className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? <Loader2 className="h-3 w-3 animate-spin" />
                    : <Trash2 className="h-3 w-3" />
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={(e) => e.preventDefault()}
        className="flex items-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
      >
        {uploadMutation.isPending
          ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          : <ImagePlus className="h-4 w-4 text-muted-foreground" />
        }
        <span className="text-sm text-muted-foreground">
          {uploadMutation.isPending ? "Uploading…" : "Click or drag to add images"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
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
