"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/lib/httpClient";
import { DepartmentModel } from "@/types/department";
import { TableResponse } from "@/types/api";

export const deptSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  name: z.string().min(2, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type DeptFormValues = z.infer<typeof deptSchema>;

export function useDepartments() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentModel | null>(null);

  const { data, isLoading } = useQuery<TableResponse<DepartmentModel>>({
    queryKey: ["departments-list", page, search],
    queryFn: async () => {
      const { data } = await httpClient.get("/department", {
        params: { page, pageSize: 10, search: search || undefined },
      });
      // API returns array (no pagination) — normalise
      if (Array.isArray(data)) {
        return { items: data, total: data.length, page: 1, pageSize: data.length, totalPage: 1 };
      }
      return data;
    },
  });

  const form = useForm<DeptFormValues>({
    resolver: zodResolver(deptSchema),
    defaultValues: { code: "", name: "", description: "", isActive: true },
  });

  const openCreate = () => {
    setEditing(null);
    form.reset({ code: "", name: "", description: "", isActive: true });
    setDialogOpen(true);
  };

  const openEdit = (dept: DepartmentModel) => {
    setEditing(dept);
    form.reset({ code: dept.code, name: dept.name, description: dept.description ?? "", isActive: dept.isActive });
    setDialogOpen(true);
  };

  const createMutation = useMutation({
    mutationFn: async (values: DeptFormValues) => {
      const { data } = await httpClient.post("/department", values);
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments-list"] }); queryClient.invalidateQueries({ queryKey: ["departments"] }); setDialogOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: DeptFormValues) => {
      const { data } = await httpClient.patch(`/department/${editing?._id}`, values);
      return data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments-list"] }); queryClient.invalidateQueries({ queryKey: ["departments"] }); setDialogOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/department/${id}`);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["departments-list"] }); },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: DeptFormValues) => {
    if (editing) updateMutation.mutate(values);
    else createMutation.mutate(values);
  };

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    totalPage: data?.totalPage ?? 1,
    isLoading,
    page, setPage,
    search, setSearch,
    dialogOpen, setDialogOpen,
    editing,
    form, onSubmit, isPending,
    openCreate, openEdit,
    deleteMutation,
  };
}
