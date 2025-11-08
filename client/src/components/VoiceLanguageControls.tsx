import { Mic, MicOff, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface VoiceLanguageControlsProps {
  onVoiceToggle?: (enabled: boolean) => void;
}

export default function VoiceLanguageControls({
  onVoiceToggle,
}: VoiceLanguageControlsProps) {
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "mr", name: "मराठी", flag: "🇮🇳" },
    { code: "te", name: "తెలుగు", flag: "🇮🇳" },
  ];

  const handleVoiceToggle = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    onVoiceToggle?.(newState);
    console.log("Voice toggled:", newState);
  };

  const handleLanguageChange = (langCode: "en" | "hi" | "mr" | "te") => {
    setLanguage(langCode);
    console.log("Language changed to:", langCode);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-card-border rounded-lg p-2">
      <Button
        size="icon"
        variant={voiceEnabled ? "default" : "ghost"}
        onClick={handleVoiceToggle}
        data-testid="button-voice-toggle"
        className={voiceEnabled ? "animate-pulse" : ""}
      >
        {voiceEnabled ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" data-testid="button-language">
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as "en" | "hi" | "mr" | "te")}
              data-testid={`option-language-${lang.code}`}
              className={language === lang.code ? "bg-accent" : ""}
            >
              <span className="mr-2">{lang.flag}</span>
              {lang.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
