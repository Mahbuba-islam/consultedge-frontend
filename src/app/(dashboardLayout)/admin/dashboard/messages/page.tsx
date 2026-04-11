import ChatWorkspace from "@/components/modules/ChatRoom/ChatWorkspace";

type AdminMessagesPageProps = {
  searchParams?: Promise<{
    expertId?: string | string[];
  }>;
};

export default async function AdminMessagesPage({ searchParams }: AdminMessagesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expertId = Array.isArray(resolvedSearchParams.expertId)
    ? resolvedSearchParams.expertId[0]
    : resolvedSearchParams.expertId;

  return (
    <ChatWorkspace
      basePath="/admin/dashboard/messages"
      dashboardHref="/admin/dashboard"
      expertId={expertId}
      title="Admin message desk"
      description="Monitor live conversations in a read-only, support-friendly workspace."
      readOnly
    />
  );
}
