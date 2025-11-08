import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import TrackPage from "../../pages/TrackPage";

export default function TrackPageExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <TrackPage trackId="track1" />
    </QueryClientProvider>
  );
}
