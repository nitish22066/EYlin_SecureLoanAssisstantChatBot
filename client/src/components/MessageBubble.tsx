import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

// Function to parse and render message with download links
function renderMessageContent(message: string) {
  // Check if message contains markdown-style link [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  if (!linkRegex.test(message)) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>;
  }

  // Split message by links and render appropriately
  const parts = message.split(linkRegex);
  const elements: (string | JSX.Element)[] = [];
  
  for (let i = 0; i < parts.length; i += 3) {
    // Regular text
    if (parts[i]) {
      elements.push(parts[i]);
    }
    
    // Link text and URL (if they exist)
    if (parts[i + 1] && parts[i + 2]) {
      const linkText = parts[i + 1];
      const linkUrl = parts[i + 2];
      
      elements.push(
        <Button
          key={i}
          variant="secondary"
          size="sm"
          className="mx-1 my-1"
          onClick={() => {
            // Open download link in new tab
            window.open(linkUrl, '_blank');
          }}
        >
          📄 {linkText}
        </Button>
      );
    }
  }
  
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {elements.map((element, index) => (
        <span key={index}>{element}</span>
      ))}
    </div>
  );
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
        {renderMessageContent(message)}
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
