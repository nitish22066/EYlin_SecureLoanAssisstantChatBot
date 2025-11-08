import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send, ArrowRight } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import MessageBubble from "@/components/MessageBubble";
import DocumentUpload from "@/components/DocumentUpload";
import SanctionLetter from "@/components/SanctionLetter";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  text: string;
  isUser: boolean;
}

interface ConversationPageProps {
  loanType: "car-loan" | "education-loan" | "business-loan" | "two-wheeler-loan" | "home-improvement" | "personal-loan" | "other-loan";
}

const conversationStarters: Record<string, string> = {
  "car-loan": "Hi there! 🚗 That's exciting — a new ride coming up! Could you share approximately how much you're looking to borrow for your car?",
  "education-loan": "Hey! 👋 That's awesome — investing in Data Science is a great move. Which institute or course are you enrolling in?",
  "business-loan": "That's great to hear! 🍲 Please share your business name and loan amount.",
  "two-wheeler-loan": "Hi! 🛵 Looking for a two-wheeler? Great choice! What's your budget for the vehicle?",
  "home-improvement": "Hello! 🏠 Home improvements are always exciting! What kind of renovations are you planning?",
  "personal-loan": "Hi there! 💰 I'm here to help with your personal loan. Could you tell me what you need the loan for?",
  "other-loan": "Hello! 💡 I'm here to help you explore our loan options. Could you tell me what kind of loan you're looking for?",
};

export default function ConversationPage({ loanType }: ConversationPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const starter = conversationStarters[loanType] || conversationStarters["other-loan"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([{ text: starter, isUser: false }]);
    }, 500);
    return () => clearTimeout(timer);
  }, [starter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setUserInput("");

    setTimeout(() => {
      const response = getEylinResponse(userMessage, loanType, messages.length);
      setMessages((prev) => [...prev, { text: response, isUser: false }]);
      
      if (response.toLowerCase().includes("upload") || response.toLowerCase().includes("documents")) {
        setTimeout(() => setShowDocUpload(true), 500);
      }
    }, 1000);
  };

  const getEylinResponse = (userMessage: string, type: string, messageCount: number): string => {
    const lowerMsg = userMessage.toLowerCase();

    if (lowerMsg.includes("done") || lowerMsg.includes("uploaded") || lowerMsg.includes("submit")) {
      return "Thanks, I've verified your details. 👍 Your application looks good! Let me process this and get back to you with an update shortly.";
    }

    if (messageCount <= 2) {
      return "Perfect. And your monthly income range? (Just a rough number helps me find the right offer.)";
    }
    
    if (messageCount <= 4) {
      return "Great — that's a solid income! Let's proceed with your KYC. Please upload your required documents (PAN Card, Salary Slip, etc.).";
    }

    return "Thank you for providing that information. I'm processing your request. Is there anything else you'd like to know about this loan?";
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
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message.text}
              isUser={message.isUser}
            />
          ))}

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
              />
              <Button
                onClick={handleSend}
                size="icon"
                data-testid="button-send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
