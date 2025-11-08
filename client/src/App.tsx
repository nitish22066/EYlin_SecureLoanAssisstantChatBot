import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import HomePage from "@/pages/HomePage";
import TrackPage from "@/pages/TrackPage";
import ConversationPage from "@/pages/ConversationPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/track1">
        {() => <TrackPage trackId="track1" />}
      </Route>
      <Route path="/track2">
        {() => <TrackPage trackId="track2" />}
      </Route>
      <Route path="/conversation/car-loan">
        {() => <ConversationPage loanType="car-loan" />}
      </Route>
      <Route path="/conversation/education-loan">
        {() => <ConversationPage loanType="education-loan" />}
      </Route>
      <Route path="/conversation/business-loan">
        {() => <ConversationPage loanType="business-loan" />}
      </Route>
      <Route path="/conversation/two-wheeler-loan">
        {() => <ConversationPage loanType="two-wheeler-loan" />}
      </Route>
      <Route path="/conversation/home-improvement">
        {() => <ConversationPage loanType="home-improvement" />}
      </Route>
      <Route path="/conversation/personal-loan">
        {() => <ConversationPage loanType="personal-loan" />}
      </Route>
      <Route path="/conversation/other-loan">
        {() => <ConversationPage loanType="other-loan" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
