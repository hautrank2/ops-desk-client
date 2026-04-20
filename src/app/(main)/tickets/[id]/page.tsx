"use client";

import { useParams } from "next/navigation";
import { TicketDetail } from "@/components/tickets/TicketDetail";
import { TicketForm } from "@/components/page/TicketForm";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const isEdit = true;
  return isEdit ? <TicketForm id={id} /> : <TicketDetail id={id} />;
}
