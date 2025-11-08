import VoiceLanguageControls from "../VoiceLanguageControls";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function VoiceLanguageControlsExample() {
  return (
    <LanguageProvider>
      <VoiceLanguageControls />
    </LanguageProvider>
  );
}
