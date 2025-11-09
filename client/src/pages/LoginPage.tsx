import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Shield, Zap, Clock, Heart, Mic, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-center min-h-screen gap-8">
        
        {/* Chatbot Information Panel */}
        <div className="hidden lg:block lg:w-1/2 space-y-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💜</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meet EYLIN</h1>
            <p className="text-xl text-gray-600">Your AI-Powered Loan Assistant</p>
          </div>

          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                What EYLIN Can Do For You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Instant Loan Processing</h3>
                    <p className="text-sm text-gray-600">Get pre-approved for loans in minutes, not days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Secure Document Verification</h3>
                    <p className="text-sm text-gray-600">Bank-grade security for all your financial documents</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">24/7 Availability</h3>
                    <p className="text-sm text-gray-600">Apply for loans anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Personalized Experience</h3>
                    <p className="text-sm text-gray-600">Tailored loan options based on your profile</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-4">
              <CardTitle>Supported Loan Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Car Loans</Badge>
                <Badge variant="secondary">Education Loans</Badge>
                <Badge variant="secondary">Business Loans</Badge>
                <Badge variant="secondary">Personal Loans</Badge>
                <Badge variant="secondary">Home Improvement</Badge>
                <Badge variant="secondary">Two Wheeler</Badge>
                <Badge variant="secondary">Rent Deposit</Badge>
                <Badge variant="secondary">Digital Credit</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              <span>Voice Enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Multi-Language</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Bank-Grade Security</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Welcome Back!</CardTitle>
              <CardDescription>
                Login to continue your loan application journey with EYLIN
              </CardDescription>
            </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setLocation("/register")}
                className="text-primary hover:underline"
              >
                Register here
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Mobile Info Card */}
      <Card className="lg:hidden mt-8 p-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-lg">About EYLIN</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Your AI-powered loan assistant for instant, secure, and personalized loan processing
          </p>
          <div className="flex justify-center gap-4 text-xs">
            <Badge variant="secondary">AI-Powered</Badge>
            <Badge variant="secondary">Secure</Badge>
            <Badge variant="secondary">Fast</Badge>
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
}

