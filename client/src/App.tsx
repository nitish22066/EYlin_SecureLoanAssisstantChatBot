import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/HomePage";
import TrackPage from "@/pages/TrackPage";
import ConversationPage from "@/pages/ConversationPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/">
        {() => <ProtectedRoute><HomePage /></ProtectedRoute>}
      </Route>
      <Route path="/applications">
        {() => <ProtectedRoute><ApplicationsPage /></ProtectedRoute>}
      </Route>
      <Route path="/chat/:conversationId">
        {(params) => (
          <ProtectedRoute>
            <ConversationPage conversationId={params.conversationId} />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/track1">
        {() => <ProtectedRoute><TrackPage trackId="track1" /></ProtectedRoute>}
      </Route>
      <Route path="/track2">
        {() => <ProtectedRoute><TrackPage trackId="track2" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/car-loan">
        {() => <ProtectedRoute><ConversationPage loanType="car-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/education-loan">
        {() => <ProtectedRoute><ConversationPage loanType="education-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/education-loan-escalation">
        {() => <ProtectedRoute><ConversationPage loanType="education-loan-escalation" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/business-loan">
        {() => <ProtectedRoute><ConversationPage loanType="business-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/skill-course-loan">
        {() => <ProtectedRoute><ConversationPage loanType="skill-course-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/rent-deposit-loan">
        {() => <ProtectedRoute><ConversationPage loanType="rent-deposit-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/digital-credit-loan">
        {() => <ProtectedRoute><ConversationPage loanType="digital-credit-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/small-business-loan">
        {() => <ProtectedRoute><ConversationPage loanType="small-business-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/two-wheeler-loan">
        {() => <ProtectedRoute><ConversationPage loanType="two-wheeler-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/home-improvement">
        {() => <ProtectedRoute><ConversationPage loanType="home-improvement" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/personal-loan">
        {() => <ProtectedRoute><ConversationPage loanType="personal-loan" /></ProtectedRoute>}
      </Route>
      <Route path="/conversation/other-loan">
        {() => <ProtectedRoute><ConversationPage loanType="other-loan" /></ProtectedRoute>}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
