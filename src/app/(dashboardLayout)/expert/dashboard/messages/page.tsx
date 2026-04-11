import ChatWorkspace from "@/components/modules/ChatRoom/ChatWorkspace";

type ExpertMessagesPageProps = {
  searchParams?: Promise<{
    expertId?: string | string[];
  }>;
};

export default async function ExpertMessagesPage({ searchParams }: ExpertMessagesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const expertId = Array.isArray(resolvedSearchParams.expertId)
    ? resolvedSearchParams.expertId[0]
    : resolvedSearchParams.expertId;

  return (
    <ChatWorkspace
      basePath="/expert/dashboard/messages"
      dashboardHref="/expert/dashboard"
      expertId={expertId}
      title="Expert messages"
      description="Respond to clients quickly and keep every consultation thread organized."
    />
  );
}
