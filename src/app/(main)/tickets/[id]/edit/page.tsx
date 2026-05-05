"use client";

import { useParams } from "next/navigation";
import { TicketForm } from "@/components/tickets/TicketForm";

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <TicketForm id={id} />;
}
