import { ShieldCheck, Wifi, WifiOff } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getParticipantDisplayName } from "@/src/services/chatRoom.service";
import type { ChatRoom } from "@/src/types/chat.types";
import CallControls from "./CallControls";
import PresenceBadge from "./PresenceBadge";

interface ChatRoomHeaderProps {
  room: ChatRoom;
  currentUserId?: string;
  isConnected?: boolean;
  isOnline?: boolean;
  lastSeen?: string | null;
  readOnly?: boolean;
  isInCall?: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}

export default function ChatRoomHeader({
  room,
  currentUserId,
  isConnected = false,
  isOnline = false,
  lastSeen,
  readOnly = false,
  isInCall = false,
  onStartCall,
  onEndCall,
}: ChatRoomHeaderProps) {
  const otherParticipants = room.participants.filter(
    (participant) => (participant.userId ?? participant.id) !== currentUserId,
  );

  const primaryParticipant = otherParticipants[0] ?? room.participants[0];
  const title =
    room.name ||
    otherParticipants.map((participant) => getParticipantDisplayName(participant)).join(", ") ||
    "Conversation";

  return (
    <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-3">
        <Avatar className="size-11 border bg-background">
          {primaryParticipant?.avatarUrl || primaryParticipant?.profilePhoto ? (
            <AvatarImage
              src={primaryParticipant.avatarUrl || primaryParticipant.profilePhoto || undefined}
              alt={getParticipantDisplayName(primaryParticipant)}
            />
          ) : null}
          <AvatarFallback>
            {getParticipantDisplayName(primaryParticipant).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
            <Badge variant="outline" className="gap-1">
              {isConnected ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
              {isConnected ? "Live" : "Offline sync"}
            </Badge>
            {readOnly ? (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="size-3.5" />
                Read only
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {primaryParticipant?.title ? <span>{primaryParticipant.title}</span> : null}
            <PresenceBadge isOnline={isOnline} lastSeen={lastSeen} />
          </div>
        </div>
      </div>

      <CallControls
        canStartCall={!readOnly}
        isInCall={isInCall}
        onStartCall={onStartCall}
        onEndCall={onEndCall}
      />
    </div>
  );
}
