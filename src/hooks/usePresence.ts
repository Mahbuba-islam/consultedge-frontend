"use client";

import { useMemo } from "react";

import { useChatSocketContext } from "@/src/providers/ChatSocketProvider";

export const usePresence = () => {
  const { presenceMap, currentUser } = useChatSocketContext();

  return useMemo(
    () => ({
      presenceMap,
      currentUser,
      getPresence: (userId?: string | null) =>
        userId ? presenceMap[userId] ?? { userId, isOnline: false, lastSeen: null } : null,
    }),
    [currentUser, presenceMap],
  );
};

export default usePresence;
