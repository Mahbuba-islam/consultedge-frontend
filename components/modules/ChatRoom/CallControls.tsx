import { Phone, PhoneOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CallControlsProps {
  canStartCall: boolean;
  isInCall: boolean;
  disabled?: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}

export default function CallControls({
  canStartCall,
  isInCall,
  disabled = false,
  onStartCall,
  onEndCall,
}: CallControlsProps) {
  return (
    <TooltipProvider>
      {isInCall ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="destructive" size="sm" onClick={onEndCall} disabled={disabled}>
              <PhoneOff className="mr-2 size-4" />
              End call
            </Button>
          </TooltipTrigger>
          <TooltipContent>End the current video call</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onStartCall}
              disabled={!canStartCall || disabled}
            >
              <Phone className="mr-2 size-4" />
              Start call
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {canStartCall ? "Start a secure video call" : "Read-only accounts cannot start calls"}
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  );
}
