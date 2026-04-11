import { io, Socket } from "socket.io-client";

import type { SocketAuthPayload } from "@/src/types/chat.types";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:5000";

let socketInstance: Socket | null = null;

export const getChatSocketClient = (auth?: SocketAuthPayload) => {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER_URL, {
      autoConnect: false,
      withCredentials: true,
      transports: ["websocket", "polling"],
      auth,
    });
  }

  if (auth) {
    socketInstance.auth = auth;
  }

  return socketInstance;
};

export const disconnectChatSocketClient = () => {
  socketInstance?.disconnect();
  socketInstance = null;
};
