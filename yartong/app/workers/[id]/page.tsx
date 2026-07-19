import { redirect } from "next/navigation";

export default async function LegacyWorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  redirect(`/providers/${id}`);
}
