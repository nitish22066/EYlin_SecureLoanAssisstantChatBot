import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import ConversationPage from "../../pages/ConversationPage";

export default function ConversationPageExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConversationPage loanType="car-loan" />
    </QueryClientProvider>
  );
}
