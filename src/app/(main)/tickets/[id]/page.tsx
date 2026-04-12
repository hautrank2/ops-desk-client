"use client";

import { useParams } from "next/navigation";
import { TicketDetail } from "@/components/tickets/TicketDetail";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <TicketDetail id={id} />;
}
