import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from "../../pages/HomePage";

export default function HomePageExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
