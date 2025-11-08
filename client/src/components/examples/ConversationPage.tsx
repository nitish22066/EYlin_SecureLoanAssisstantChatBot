import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ConversationPage from "../../pages/ConversationPage";

export default function ConversationPageExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ConversationPage loanType="car-loan" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
