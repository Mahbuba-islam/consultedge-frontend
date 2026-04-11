import { httpClient } from "../lib/axious/httpClient";
import type {
  ChatAttachment,
  ChatCall,
  ChatCallStatus,
  ChatMessage,
  ChatMessageType,
  ChatParticipant,
  ChatRoom,
  ChatRole,
} from "../types/chat.types";

const CHAT_BASE_PATH = "/chat";

const toArray = (value: unknown, nestedKeys: string[] = []): any[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    for (const nestedKey of nestedKeys) {
      const nestedValue = (value as Record<string, unknown>)[nestedKey];

      if (Array.isArray(nestedValue)) {
        return nestedValue;
      }
    }
  }

  return [];
};

export const getParticipantDisplayName = (participant?: ChatParticipant | null) =>
  participant?.fullName || participant?.name || participant?.email || "Unknown participant";

const normalizeParticipant = (value: any): ChatParticipant => ({
  id: String(value?.id ?? value?.userId ?? value?.participantId ?? crypto.randomUUID()),
  userId: value?.userId ? String(value.userId) : undefined,
  role: (value?.role ?? "CLIENT") as ChatRole,
  fullName: value?.fullName ?? value?.name ?? value?.user?.name,
  name: value?.name ?? value?.fullName ?? value?.user?.name,
  title: value?.title,
  email: value?.email ?? value?.user?.email,
  profilePhoto: value?.profilePhoto ?? value?.image ?? value?.avatarUrl ?? null,
  avatarUrl: value?.avatarUrl ?? value?.profilePhoto ?? value?.image ?? null,
  isOnline: value?.isOnline,
  lastSeen: value?.lastSeen ?? null,
});

const normalizeAttachment = (value: any): ChatAttachment => ({
  id: value?.id,
  fileName: value?.fileName ?? value?.name ?? "Attachment",
  url: value?.url ?? value?.path ?? value?.secure_url ?? "",
  mimeType: value?.mimeType ?? value?.type,
  size: value?.size,
});

export const normalizeChatMessage = (value: any): ChatMessage => {
  const raw = value?.message ?? value?.data ?? value;
  const sender = raw?.sender || raw?.user || raw?.author ? normalizeParticipant(raw.sender ?? raw.user ?? raw.author) : null;
  const attachment = raw?.attachment || raw?.file || raw?.media;

  return {
    id: String(raw?.id ?? `message-${Date.now()}`),
    roomId: String(raw?.roomId ?? raw?.chatRoomId ?? ""),
    text: raw?.text ?? raw?.content ?? "",
    type: String(raw?.type ?? (attachment ? "FILE" : "TEXT")) as ChatMessageType,
    createdAt: raw?.createdAt ?? new Date().toISOString(),
    updatedAt: raw?.updatedAt,
    senderId: String(raw?.senderId ?? sender?.userId ?? sender?.id ?? "unknown"),
    senderRole: (raw?.senderRole ?? sender?.role ?? "CLIENT") as ChatRole,
    sender,
    attachment: attachment ? normalizeAttachment(attachment) : null,
    pending: Boolean(raw?.pending),
    failed: Boolean(raw?.failed),
  };
};

export const normalizeChatRoom = (value: any): ChatRoom => {
  const raw = value?.room ?? value?.data ?? value;
  const participants = toArray(raw?.participants ?? raw?.members ?? raw?.users).map(normalizeParticipant);
  const lastMessage = raw?.lastMessage ? normalizeChatMessage(raw.lastMessage) : null;

  return {
    id: String(raw?.id ?? raw?.roomId ?? crypto.randomUUID()),
    name:
      raw?.name ??
      raw?.title ??
      (participants.map((participant) => getParticipantDisplayName(participant)).join(", ") ||
        "Conversation"),
    participants,
    lastMessage,
    unreadCount: Number(raw?.unreadCount ?? raw?.unread ?? 0),
    updatedAt: raw?.updatedAt ?? lastMessage?.createdAt ?? raw?.createdAt ?? new Date().toISOString(),
    expertId:
      raw?.expertId ?? participants.find((participant) => participant.role === "EXPERT")?.id,
    clientId:
      raw?.clientId ?? participants.find((participant) => participant.role === "CLIENT")?.id,
  };
};

const normalizeChatCall = (value: any): ChatCall => {
  const raw = value?.call ?? value?.data ?? value;

  return {
    id: String(raw?.id ?? raw?.callId ?? `call-${Date.now()}`),
    roomId: String(raw?.roomId ?? raw?.chatRoomId ?? ""),
    status: (raw?.status ?? "RINGING") as ChatCallStatus,
    startedAt: raw?.startedAt ?? raw?.createdAt,
    startedBy: raw?.startedBy ?? raw?.callerId,
  };
};

export const mergeUniqueMessages = (messages: ChatMessage[]) => {
  const merged = new Map<string, ChatMessage>();

  messages.forEach((message) => {
    merged.set(message.id, message);
  });

  return [...merged.values()].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
};

export const sortChatRooms = (rooms: ChatRoom[]) => {
  return [...rooms].sort(
    (left, right) =>
      new Date(right.updatedAt ?? right.lastMessage?.createdAt ?? 0).getTime() -
      new Date(left.updatedAt ?? left.lastMessage?.createdAt ?? 0).getTime(),
  );
};

export const getChatRooms = async (params?: Record<string, unknown>): Promise<ChatRoom[]> => {
  const response = await httpClient.get<ChatRoom[] | { rooms?: ChatRoom[] }>(
    `${CHAT_BASE_PATH}/rooms`,
    {
      params,
      silent: true,
    },
  );

  const rooms = toArray(response.data, ["rooms", "items", "data"]);
  return sortChatRooms(rooms.map(normalizeChatRoom));
};

export const findOrCreateRoomForExpert = async (expertId: string): Promise<ChatRoom | null> => {
  if (!expertId) {
    return null;
  }

  try {
    const response = await httpClient.post<ChatRoom | { room?: ChatRoom }>(
      `${CHAT_BASE_PATH}/rooms`,
      { expertId },
      { silent: true },
    );

    if (response.data) {
      return normalizeChatRoom(response.data);
    }
  } catch {
    // fallback to existing room lookup when POST is not available
  }

  const rooms = await getChatRooms({ expertId });

  return (
    rooms.find(
      (room) =>
        room.expertId === expertId ||
        room.participants.some(
          (participant) => participant.id === expertId || participant.userId === expertId,
        ),
    ) ?? null
  );
};

export const getRoomMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const response = await httpClient.get<ChatMessage[] | { messages?: ChatMessage[] }>(
    `${CHAT_BASE_PATH}/rooms/${roomId}/messages`,
    { silent: true },
  );

  const messages = toArray(response.data, ["messages", "items", "data"]);
  return mergeUniqueMessages(messages.map(normalizeChatMessage));
};

export const sendRoomMessage = async (
  roomId: string,
  payload: { text: string },
): Promise<ChatMessage> => {
  const response = await httpClient.post<ChatMessage>(
    `${CHAT_BASE_PATH}/rooms/${roomId}/messages`,
    { text: payload.text },
    { silent: true },
  );

  return normalizeChatMessage(response.data);
};

export const uploadRoomAttachment = async (
  roomId: string,
  file: File,
): Promise<ChatMessage> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await httpClient.post<ChatMessage>(
    `${CHAT_BASE_PATH}/rooms/${roomId}/attachments`,
    formData,
    {
      silent: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return normalizeChatMessage(response.data);
};

export const startRoomCall = async (roomId: string): Promise<ChatCall> => {
  const response = await httpClient.post<ChatCall>(
    `${CHAT_BASE_PATH}/rooms/${roomId}/calls`,
    {},
    { silent: true },
  );

  return normalizeChatCall(response.data);
};

export const updateCallStatus = async (
  callId: string,
  status: ChatCallStatus = "ENDED",
): Promise<ChatCall> => {
  const response = await httpClient.patch<ChatCall>(
    `${CHAT_BASE_PATH}/calls/${callId}/status`,
    { status },
    { silent: true },
  );

  return normalizeChatCall(response.data);
};
