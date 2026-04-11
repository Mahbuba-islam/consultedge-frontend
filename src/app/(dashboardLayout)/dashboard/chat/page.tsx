import ChatWorkspace from "@/components/modules/ChatRoom/ChatWorkspace";

type ClientChatPageProps = {
  searchParams?: Promise<{
    expertId?: string | string[];
  }>;
};

export default async function ClientChatPage({ searchParams }: ClientChatPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expertId = Array.isArray(resolvedSearchParams.expertId)
    ? resolvedSearchParams.expertId[0]
    : resolvedSearchParams.expertId;

  return (
    <ChatWorkspace
      basePath="/dashboard/chat"
      dashboardHref="/dashboard"
      expertId={expertId}
      title="Client messages"
      description="Message experts, share files, and manage active consultations."
    />
  );
}
