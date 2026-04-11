import ChatWorkspace from "@/components/modules/ChatRoom/ChatWorkspace";

type ClientChatRoomPageProps = {
  params: Promise<{
    roomId: string;
  }>;
};

export default async function ClientChatRoomPage({ params }: ClientChatRoomPageProps) {
  const { roomId } = await params;

  return (
    <ChatWorkspace
      basePath="/dashboard/chat"
      dashboardHref="/dashboard"
      selectedRoomId={roomId}
      title="Client messages"
      description="Message experts, share files, and manage active consultations."
    />
  );
}
