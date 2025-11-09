import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Checking authentication...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <p className="text-muted-foreground">
              Please login to access EYLIN Financial Services
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={() => setLocation("/login")} 
              className="w-full"
            >
              Login
            </Button>
            <Button 
              onClick={() => setLocation("/register")} 
              variant="outline"
              className="w-full"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}