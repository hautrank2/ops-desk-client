import { MainLayout } from "@/components/layout/MainLayout";
import AssetForm from "@/pages/AssetForm";

export default function Page({ params }: { params: { id: string } }) {
  return (
    <MainLayout>
      <AssetForm />
    </MainLayout>
  );
}
