"use client";

import { useEffect } from "react";

import { useChatSocketContext } from "@/src/providers/ChatSocketProvider";

export const useChatSocket = (roomId?: string) => {
  const context = useChatSocketContext();
  const { socket } = context;

  useEffect(() => {
    if (!socket || !roomId) {
      return;
    }

    socket.emit("join_room", roomId);
  }, [roomId, socket]);

  return {
    ...context,
    emit: (event: string, payload?: unknown) => {
      socket?.emit(event, payload);
    },
  };
};

export default useChatSocket;
