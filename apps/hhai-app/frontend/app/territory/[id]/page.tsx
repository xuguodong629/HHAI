import { TerritoryManager } from "@/features/territory/territory-manager";

export default async function TerritoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TerritoryManager detailId={id} />;
}