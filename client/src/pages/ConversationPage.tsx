import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send, ArrowRight, Loader2, Save, FileText } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import MessageBubble from "@/components/MessageBubble";
import DocumentUpload from "@/components/DocumentUpload";
import SanctionLetter from "@/components/SanctionLetter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ConversationPageProps {
  loanType?: "car-loan" | "education-loan" | "education-loan-escalation" | "business-loan" | "skill-course-loan" | "rent-deposit-loan" | "digital-credit-loan" | "small-business-loan" | "two-wheeler-loan" | "home-improvement" | "personal-loan" | "other-loan";
  conversationId?: string;
}

export default function ConversationPage({ loanType, conversationId: existingConversationId }: ConversationPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const createConversationMutation = useMutation({
    mutationFn: async (loanType: string) => {
      const res = await apiRequest("POST", "/api/conversations", { loanType });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setConversationId(data.conversationId);
      if (data.message) {
        setMessages([data.message]);
      } else {
        setMessages([]);
      }
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ conversationId, text }: { conversationId: string; text: string }) => {
      setIsTyping(true);
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/messages`, { text });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, data.message]);
      
      const responseText = data.message.text.toLowerCase();
      if (responseText.includes("upload") || responseText.includes("documents") || responseText.includes("kyc")) {
        setTimeout(() => setShowDocUpload(true), 500);
      }
    },
    onError: () => {
      setIsTyping(false);
    },
  });

  const saveApplicationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const res = await apiRequest("POST", `/api/conversations/${conversationId}/save-application`);
      return await res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Application Saved",
        description: `Your conversation has been saved as loan application ${data.applicationId}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: "Failed to save conversation as application. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Function to load existing conversation
  const loadExistingConversation = async (existingConversationId: string) => {
    try {
      const res = await apiRequest("GET", `/api/conversations/${existingConversationId}`);
      const conversation = await res.json();
      
      setConversationId(existingConversationId);
      if (conversation.messages && Array.isArray(conversation.messages)) {
        setMessages(conversation.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast({
        title: "Error",
        description: "Failed to load conversation",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (loanType) {
      // Create new conversation with loanType
      createConversationMutation.mutate(loanType);
    } else if (existingConversationId) {
      // Load existing conversation
      loadExistingConversation(existingConversationId);
    }
  }, [loanType, existingConversationId]);

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
    console.log("Documents uploaded - automatically triggering AI response");
    
    // Automatically send a message indicating documents have been uploaded
    if (conversationId) {
      sendMessageMutation.mutate({ 
        conversationId, 
        text: "I have uploaded my documents. Please review them." 
      });
    }
  };

  const loanTitles: Record<string, string> = {
    "car-loan": t("loan.car"),
    "education-loan": t("loan.education"),
    "education-loan-escalation": t("loan.education") + " (Escalation)",
    "business-loan": t("loan.business"),
    "skill-course-loan": t("loan.skillcourse"),
    "rent-deposit-loan": t("loan.rentdeposit"),
    "digital-credit-loan": t("loan.digitalcredit"),
    "small-business-loan": t("loan.smallbusiness"),
    "two-wheeler-loan": t("loan.twowheeler"),
    "home-improvement": t("loan.home"),
    "personal-loan": t("loan.personal"),
    "other-loan": t("loan.other"),
  };

  const handleApproval = () => {
    setShowApproval(true);
  };

  const handleSaveApplication = () => {
    if (conversationId) {
      saveApplicationMutation.mutate(conversationId);
    }
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

          {(sendMessageMutation.isPending || isTyping) && (
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
                amount={
                  loanType === "car-loan" ? "₹7,00,000" :
                  loanType === "education-loan" ? "₹4,00,000" :
                  loanType === "skill-course-loan" ? "₹7,000" :
                  loanType === "rent-deposit-loan" ? "₹10,000" :
                  loanType === "digital-credit-loan" ? "₹6,000" :
                  loanType === "small-business-loan" ? "₹8,000" :
                  "₹4,00,000"
                }
                interestRate={
                  loanType === "car-loan" ? "10.5%" :
                  loanType === "education-loan" ? "11.0%" :
                  loanType === "skill-course-loan" ? "12.5%" :
                  loanType === "rent-deposit-loan" ? "13.0%" :
                  loanType === "digital-credit-loan" ? "12.0%" :
                  loanType === "small-business-loan" ? "13.2%" :
                  "11.0%"
                }
                tenure={
                  loanType === "car-loan" ? "48 months" :
                  loanType === "education-loan" ? "60 months" :
                  loanType === "skill-course-loan" ? "12 months" :
                  loanType === "rent-deposit-loan" ? "10 months" :
                  loanType === "digital-credit-loan" ? "9 months" :
                  loanType === "small-business-loan" ? "8 months" :
                  "60 months"
                }
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
            <div className="flex flex-col gap-3">
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
              
              {messages.length > 0 && conversationId && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveApplication}
                    variant="outline"
                    size="sm"
                    disabled={saveApplicationMutation.isPending}
                    className="flex-1"
                  >
                    {saveApplicationMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save as Loan Application
                  </Button>
                  <Button
                    onClick={() => {
                      const element = document.createElement('a');
                      element.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
                        messages.map(m => `${m.isUser ? 'You' : 'Eylin'}: ${m.text}`).join('\n\n')
                      )}`;
                      element.download = `chat-${loanType}-${new Date().toISOString().split('T')[0]}.txt`;
                      element.click();
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Export Chat
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
