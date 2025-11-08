import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send, ArrowRight, Loader2 } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import MessageBubble from "@/components/MessageBubble";
import DocumentUpload from "@/components/DocumentUpload";
import SanctionLetter from "@/components/SanctionLetter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ConversationPageProps {
  loanType: "car-loan" | "education-loan" | "business-loan" | "two-wheeler-loan" | "home-improvement" | "personal-loan" | "other-loan";
}

export default function ConversationPage({ loanType }: ConversationPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createConversationMutation = useMutation({
    mutationFn: async (loanType: string) => {
      return await apiRequest("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loanType }),
      });
    },
    onSuccess: (data: any) => {
      setConversationId(data.conversationId);
      setMessages([data.message]);
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      return await apiRequest(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    },
    onSuccess: (data: any) => {
      setMessages((prev) => [...prev, data.message]);
      
      const responseText = data.message.text.toLowerCase();
      if (responseText.includes("upload") || responseText.includes("documents") || responseText.includes("kyc")) {
        setTimeout(() => setShowDocUpload(true), 500);
      }
    },
  });

  useEffect(() => {
    createConversationMutation.mutate(loanType);
  }, [loanType]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim() || !conversationId || sendMessageMutation.isPending) return;

    const userMessage: Message = {
      text: userInput,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");

    sendMessageMutation.mutate({ conversationId, text: userInput });
  };

  const handleDocumentUpload = () => {
    setShowDocUpload(false);
    console.log("Documents uploaded - waiting for user to continue conversation");
  };

  const loanTitles: Record<string, string> = {
    "car-loan": t("loan.car"),
    "education-loan": t("loan.education"),
    "business-loan": t("loan.business"),
    "two-wheeler-loan": t("loan.twowheeler"),
    "home-improvement": t("loan.home"),
    "personal-loan": t("loan.personal"),
    "other-loan": t("loan.other"),
  };

  const handleApproval = () => {
    setShowApproval(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <VoiceLanguageControls />

      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" data-testid="text-conversation-title">
              {loanTitles[loanType]}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("chat.with")}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-home"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {createConversationMutation.isPending && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Starting conversation...</span>
            </div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}

          {sendMessageMutation.isPending && (
            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Eylin is typing...</span>
            </div>
          )}

          {showDocUpload && !showApproval && (
            <div className="mb-6 animate-in fade-in duration-300">
              <DocumentUpload
                label={t("upload.label")}
                acceptedFormats={["PDF", "JPG", "PNG"]}
              />
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleDocumentUpload}
                  className="flex-1"
                  variant="outline"
                  data-testid="button-submit-documents"
                >
                  {t("button.submit")}
                </Button>
                <Button
                  onClick={handleApproval}
                  className="flex-1"
                  data-testid="button-approve-demo"
                >
                  {t("button.demo")}
                </Button>
              </div>
            </div>
          )}

          {showApproval && (
            <div className="mb-6 animate-in fade-in duration-500">
              <SanctionLetter
                applicantName="Nitish"
                loanType={loanTitles[loanType]}
                amount={loanType === "car-loan" ? "₹7,00,000" : "₹4,00,000"}
                interestRate={loanType === "car-loan" ? "10.5%" : "11.0%"}
                tenure={loanType === "car-loan" ? "48 months" : "60 months"}
              />
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-return-menu"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  {t("button.return")}
                </Button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {!showApproval && (
        <div className="border-t border-border bg-card/50 backdrop-blur-sm sticky bottom-0">
          <div className="container mx-auto px-4 py-4 max-w-3xl">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("chat.placeholder")}
                data-testid="input-message"
                disabled={sendMessageMutation.isPending || createConversationMutation.isPending}
              />
              <Button
                onClick={handleSend}
                size="icon"
                data-testid="button-send"
                disabled={sendMessageMutation.isPending || createConversationMutation.isPending || !userInput.trim()}
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
