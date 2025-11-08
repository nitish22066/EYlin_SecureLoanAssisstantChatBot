import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

export default function MessageBubble({
  message,
  isUser,
  timestamp,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex gap-3 mb-4 animate-in fade-in duration-200",
        isUser ? "justify-end" : "justify-start"
      )}
      data-testid={`message-${isUser ? "user" : "eylin"}`}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            E
          </AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl p-4",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-md"
            : "bg-card border border-card-border rounded-tl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <span className="text-xs opacity-70 mt-1 block">{timestamp}</span>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
