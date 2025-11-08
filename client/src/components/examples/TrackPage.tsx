import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { LanguageProvider } from "@/contexts/LanguageContext";
import TrackPage from "../../pages/TrackPage";

export default function TrackPageExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TrackPage trackId="track1" />
      </LanguageProvider>
    </QueryClientProvider>
  );
}
