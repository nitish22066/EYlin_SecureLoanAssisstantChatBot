import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Send, ArrowRight } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import MessageBubble from "@/components/MessageBubble";
import DocumentUpload from "@/components/DocumentUpload";
import SanctionLetter from "@/components/SanctionLetter";

interface Message {
  text: string;
  isUser: boolean;
}

interface ConversationPageProps {
  loanType: "car-loan" | "education-loan" | "business-loan" | "two-wheeler-loan" | "home-improvement" | "personal-loan";
}

const conversationFlows: Record<string, Message[]> = {
  "car-loan": [
    { text: "Hi, I'm looking for a car loan.", isUser: true },
    {
      text: "Hi there! 🚗 That's exciting — a new ride coming up! Could you share approximately how much you're looking to borrow for your car?",
      isUser: false,
    },
    { text: "Around 7 lakh rupees.", isUser: true },
    {
      text: "Perfect. And your monthly income range? (Just a rough number helps me find the right offer.)",
      isUser: false,
    },
    { text: "Around ₹85,000 per month.", isUser: true },
    {
      text: "Great — that's a solid income! Let's proceed with your KYC. Please upload your PAN Card and Salary Slip (last 3 months).",
      isUser: false,
    },
  ],
  "education-loan": [
    { text: "Hi, I want to apply for a loan for my Data Science course.", isUser: true },
    {
      text: "Hey! 👋 That's awesome — investing in Data Science is a great move. Which institute or course are you enrolling in?",
      isUser: false,
    },
    { text: "Data Science PG Program at Great Learning.", isUser: true },
    {
      text: "Perfect choice — that's one of our partnered institutions! And how much is your total course fee?",
      isUser: false,
    },
    { text: "Around ₹4 lakh.", isUser: true },
    {
      text: "Got it. Since you're applying as a student, please share your parent or guardian's monthly income.",
      isUser: false,
    },
    { text: "Around ₹50,000.", isUser: true },
    {
      text: "Thanks! Please upload your Admission Letter and your parent's ITR or Salary Slip.",
      isUser: false,
    },
  ],
  "business-loan": [
    { text: "Hi, I want a business loan to expand my food manufacturing unit.", isUser: true },
    {
      text: "That's great to hear! 🍲 Please share your business name and loan amount.",
      isUser: false,
    },
    { text: "Arjun Foods Pvt. Ltd. — ₹40 lakhs.", isUser: true },
    {
      text: "Excellent. Please upload your Business PAN and GST Return.",
      isUser: false,
    },
  ],
};

export default function ConversationPage({ loanType }: ConversationPageProps) {
  const [, setLocation] = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const flow = conversationFlows[loanType] || conversationFlows["car-loan"];

  useEffect(() => {
    if (currentStep < flow.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, flow[currentStep]]);
        setCurrentStep((prev) => prev + 1);

        if (
          flow[currentStep].text.includes("upload") ||
          flow[currentStep].text.includes("Upload")
        ) {
          setTimeout(() => setShowDocUpload(true), 500);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, flow]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { text: userInput, isUser: true }]);
    setUserInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: "I only handle approved loan conversations. Please choose a valid loan type or return to the main menu.",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  const handleDocumentUpload = () => {
    setShowDocUpload(false);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Done.", isUser: true },
      ]);
    }, 500);

    setTimeout(() => {
      const approvalMessages: Record<string, string> = {
        "car-loan":
          "Thanks, I've verified your details. 👍 Your credit score looks great at 760 and you're eligible for our Car Loan Offer: ₹7,00,000 at 10.5% for 48 months. Would you like me to generate your sanction letter?",
        "education-loan":
          "Perfect — I've reviewed your documents. Your credit score is 720 and with stable income support, your education loan is approved 🎓 ₹4,00,000 at 11.0% for 60 months. Would you like me to generate your sanction letter?",
        "business-loan":
          "Thanks! Verifying… Looks like your PAN is under Arjun Food Products LLP while your GST return lists Arjun Foods Pvt. Ltd. This likely means a recent business structure change — no issue! 👍 I'll forward this to our Compliance Verification Team for manual review (usually within 24 hours).",
      };

      setMessages((prev) => [
        ...prev,
        {
          text: approvalMessages[loanType] || approvalMessages["car-loan"],
          isUser: false,
        },
      ]);

      if (loanType !== "business-loan") {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { text: "Yes, please.", isUser: true },
          ]);

          setTimeout(() => {
            setShowApproval(true);
          }, 1000);
        }, 2000);
      }
    }, 1500);
  };

  const loanTitles: Record<string, string> = {
    "car-loan": "Car Loan",
    "education-loan": "Education Loan",
    "business-loan": "Business Loan",
    "two-wheeler-loan": "Two-Wheeler Loan",
    "home-improvement": "Home Improvement Loan",
    "personal-loan": "Personal Loan",
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
              Chat with Eylin
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

          {showDocUpload && (
            <div className="mb-6 animate-in fade-in duration-300">
              <DocumentUpload
                label="Upload Documents"
                acceptedFormats={["PDF", "JPG", "PNG"]}
              />
              <Button
                onClick={handleDocumentUpload}
                className="mt-4 w-full"
                data-testid="button-submit-documents"
              >
                Submit Documents
              </Button>
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
                <p className="text-sm text-muted-foreground mb-4">
                  Would you like to return to the main menu to explore Track 1 or Track 2 again?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  data-testid="button-return-menu"
                >
                  <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
                  Return to Main Menu
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
                placeholder="Type your message..."
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
