"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";

import { getChatSocketClient } from "@/src/lib/chat/socketClient";
import { getMe } from "@/src/services/auth.services";
import type { IUserProfile } from "@/src/types/auth.types";
import type {
  ChatMessage,
  ChatParticipant,
  ChatRole,
  PresenceState,
  SocketAuthPayload,
  TypingState,
} from "@/src/types/chat.types";

type IncomingCallPayload = {
  roomId: string;
  callId?: string;
  callerId?: string;
  callerName?: string;
};

type CurrentChatUser = {
  userId: string;
  role: ChatRole;
  name: string;
  profilePhoto?: string | null;
};

type ChatSocketContextValue = {
  socket: Socket | null;
  currentUser: CurrentChatUser | null;
  isConnected: boolean;
  presenceMap: Record<string, PresenceState>;
  typingState: Record<string, TypingState[]>;
  incomingCall: IncomingCallPayload | null;
  setIncomingCall: React.Dispatch<React.SetStateAction<IncomingCallPayload | null>>;
  clearIncomingCall: () => void;
};

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

const uniqueMessages = (messages: ChatMessage[]) => {
  const map = new Map<string, ChatMessage>();

  messages.forEach((message) => {
    map.set(message.id, message);
  });

  return [...map.values()].sort(
    (left, right) => new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime(),
  );
};

const normalizeParticipant = (value: any): ChatParticipant | null => {
  if (!value) {
    return null;
  }

  return {
    id: String(value.id ?? value.userId ?? value.participantId ?? "unknown"),
    userId: value.userId ? String(value.userId) : undefined,
    role: (value.role ?? "CLIENT") as ChatRole,
    fullName: value.fullName ?? value.name ?? value.user?.name,
    name: value.name ?? value.fullName ?? value.user?.name,
    title: value.title,
    email: value.email ?? value.user?.email,
    profilePhoto: value.profilePhoto ?? value.image ?? value.avatarUrl ?? null,
    avatarUrl: value.avatarUrl ?? value.profilePhoto ?? value.image ?? null,
    isOnline: value.isOnline,
    lastSeen: value.lastSeen ?? null,
  };
};

const normalizeMessage = (payload: any): ChatMessage | null => {
  const value = payload?.message ?? payload?.data ?? payload;

  if (!value) {
    return null;
  }

  const sender = normalizeParticipant(value.sender ?? value.user ?? value.author);
  const attachmentValue = value.attachment ?? value.file ?? value.media;

  return {
    id: String(value.id ?? `socket-${Date.now()}`),
    roomId: String(value.roomId ?? payload?.roomId ?? ""),
    text: value.text ?? value.content ?? "",
    type: String(value.type ?? (attachmentValue ? "FILE" : "TEXT")),
    createdAt: value.createdAt ?? new Date().toISOString(),
    updatedAt: value.updatedAt,
    senderId: String(value.senderId ?? sender?.userId ?? sender?.id ?? "unknown"),
    senderRole: (value.senderRole ?? sender?.role ?? "CLIENT") as ChatRole,
    sender,
    attachment: attachmentValue
      ? {
          id: attachmentValue.id,
          fileName: attachmentValue.fileName ?? attachmentValue.name ?? "Attachment",
          url: attachmentValue.url ?? attachmentValue.path ?? attachmentValue.secure_url ?? "",
          mimeType: attachmentValue.mimeType ?? attachmentValue.type,
          size: attachmentValue.size,
        }
      : null,
  };
};

export function ChatSocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceState>>({});
  const [typingState, setTypingState] = useState<Record<string, TypingState[]>>({});
  const [incomingCall, setIncomingCall] = useState<IncomingCallPayload | null>(null);

  const { data: profile } = useQuery<IUserProfile>({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000,
  });

  const currentUser = useMemo<CurrentChatUser | null>(() => {
    if (!profile?.id || !profile.role) {
      return null;
    }

    return {
      userId: profile.id,
      role: profile.role as ChatRole,
      name:
        profile.expert?.fullName ||
        profile.client?.fullName ||
        profile.admin?.name ||
        profile.name ||
        "ConsultEdge user",
      profilePhoto: null,
    };
  }, [profile]);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const authPayload: SocketAuthPayload = {
      userId: currentUser.userId,
      role: currentUser.role,
    };

    const client = getChatSocketClient(authPayload);

    if (!client) {
      return;
    }

    setSocket(client);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    const handleReceiveMessage = (payload: any) => {
      const message = normalizeMessage(payload);

      if (!message?.roomId) {
        return;
      }

      queryClient.setQueryData<ChatMessage[]>(["chat-room-messages", message.roomId], (current) =>
        uniqueMessages([...(current ?? []), message]),
      );

      queryClient.setQueriesData({ queryKey: ["chat-rooms"] }, (current: any) => {
        if (!current) {
          return current;
        }

        const rooms = Array.isArray(current) ? current : Array.isArray(current?.data) ? current.data : [];

        if (!Array.isArray(rooms)) {
          return current;
        }

        const updatedRooms = [...rooms];
        const roomIndex = updatedRooms.findIndex((room) => room.id === message.roomId);

        if (roomIndex >= 0) {
          const existingRoom = updatedRooms[roomIndex];
          updatedRooms[roomIndex] = {
            ...existingRoom,
            lastMessage: message,
            updatedAt: message.createdAt,
            unreadCount:
              message.senderId !== currentUser.userId
                ? (existingRoom.unreadCount ?? 0) + 1
                : existingRoom.unreadCount ?? 0,
          };
        }

        const sortedRooms = updatedRooms.sort(
          (left, right) =>
            new Date(right.updatedAt ?? right.lastMessage?.createdAt ?? 0).getTime() -
            new Date(left.updatedAt ?? left.lastMessage?.createdAt ?? 0).getTime(),
        );

        return Array.isArray(current) ? sortedRooms : { ...current, data: sortedRooms };
      });
    };

    const handlePresenceUpdate = (payload: any) => {
      const entries = Array.isArray(payload) ? payload : [payload];

      setPresenceMap((current) => {
        const next = { ...current };

        entries.forEach((entry) => {
          if (!entry?.userId) {
            return;
          }

          next[String(entry.userId)] = {
            userId: String(entry.userId),
            isOnline: Boolean(entry.isOnline ?? entry.online),
            lastSeen: entry.lastSeen ?? null,
            role: entry.role,
          };
        });

        return next;
      });
    };

    const handleTyping = (payload: any) => {
      if (!payload?.roomId || !payload?.userId) {
        return;
      }

      setTypingState((current) => {
        const roomKey = String(payload.roomId);
        const existingEntries = current[roomKey] ?? [];
        const filteredEntries = existingEntries.filter((entry) => entry.userId !== String(payload.userId));

        if (!payload.isTyping) {
          return {
            ...current,
            [roomKey]: filteredEntries,
          };
        }

        return {
          ...current,
          [roomKey]: [
            ...filteredEntries,
            {
              roomId: roomKey,
              userId: String(payload.userId),
              isTyping: true,
              name: payload.name,
            },
          ],
        };
      });
    };

    const handleCallStarted = (payload: any) => {
      setIncomingCall({
        roomId: String(payload?.roomId ?? ""),
        callId: payload?.callId,
        callerId: payload?.callerId,
        callerName: payload?.callerName,
      });
    };

    const handleCallEnded = () => {
      setIncomingCall(null);
    };

    const handleChatError = (payload: any) => {
      toast.error(payload?.message || "A realtime chat error occurred.");
    };

    client.on("connect", handleConnect);
    client.on("disconnect", handleDisconnect);
    client.on("receive_message", handleReceiveMessage);
    client.on("presence_update", handlePresenceUpdate);
    client.on("typing", handleTyping);
    client.on("call_started", handleCallStarted);
    client.on("call_ended", handleCallEnded);
    client.on("chat_error", handleChatError);

    if (!client.connected) {
      client.connect();
    }

    return () => {
      client.off("connect", handleConnect);
      client.off("disconnect", handleDisconnect);
      client.off("receive_message", handleReceiveMessage);
      client.off("presence_update", handlePresenceUpdate);
      client.off("typing", handleTyping);
      client.off("call_started", handleCallStarted);
      client.off("call_ended", handleCallEnded);
      client.off("chat_error", handleChatError);
    };
  }, [currentUser, queryClient]);

  const value = useMemo<ChatSocketContextValue>(
    () => ({
      socket,
      currentUser,
      isConnected,
      presenceMap,
      typingState,
      incomingCall,
      setIncomingCall,
      clearIncomingCall: () => setIncomingCall(null),
    }),
    [socket, currentUser, isConnected, presenceMap, typingState, incomingCall],
  );

  return <ChatSocketContext.Provider value={value}>{children}</ChatSocketContext.Provider>;
}

export const useChatSocketContext = () => {
  const context = useContext(ChatSocketContext);

  if (!context) {
    throw new Error("useChatSocketContext must be used within ChatSocketProvider.");
  }

  return context;
};
