import { MainLayout } from "@/components/layout/MainLayout";
import TicketForm from "@/pages/TicketForm";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <TicketForm />
    </MainLayout>
  );
}
