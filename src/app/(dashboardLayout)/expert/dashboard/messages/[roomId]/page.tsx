import ChatWorkspace from "@/components/modules/ChatRoom/ChatWorkspace";

type ExpertMessageRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function ExpertMessageRoomPage({ params }: ExpertMessageRoomPageProps) {
  const { roomId } = await params;

  return (
    <ChatWorkspace
      basePath="/expert/dashboard/messages"
      dashboardHref="/expert/dashboard"
      selectedRoomId={roomId}
      title="Expert messages"
      description="Respond to clients quickly and keep every consultation thread organized."
    />
  );
}
