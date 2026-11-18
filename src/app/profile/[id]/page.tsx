import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfileIdRedirectPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/professionals/${encodeURIComponent(id)}`);
}
