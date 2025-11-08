import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, Globe, Shield } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import { useLocation } from "wouter";
import heroImage from "@assets/generated_images/Dual_track_banking_illustration_f80fafab.png";

export default function HomePage() {
  const [, setLocation] = useLocation();

  const tracks = [
    {
      id: "track1",
      title: "Track 1 - Metro Profit Loans",
      description:
        "Premium loan products for salaried professionals and established businesses with competitive rates and quick processing.",
      benefits: [
        "Higher loan amounts up to ₹50 Lakhs",
        "Competitive interest rates starting from 9.5%",
        "Instant digital approvals for eligible customers",
      ],
      icon: "🏢",
      badge: "Metro Loans",
    },
    {
      id: "track2",
      title: "Track 2 - Tier 2 Micro-Loans",
      description:
        "Accessible micro-financing solutions for small businesses and individuals in tier-2 cities with flexible terms.",
      benefits: [
        "Loans from ₹50,000 to ₹10 Lakhs",
        "Simplified documentation process",
        "Support for self-employed and new businesses",
      ],
      icon: "🌱",
      badge: "Micro Loans",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <VoiceLanguageControls />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <section className="text-center mb-12 pt-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">💜</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-semibold mb-4" data-testid="text-heading">
            Welcome to Eylin
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your friendly AI Loan Assistant for instant loan approvals.
            Choose your track to get started.
          </p>

          <div className="relative w-full max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden">
            <img
              src={heroImage}
              alt="Dual track banking illustration"
              className="w-full h-auto"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm mb-12">
            <Badge variant="secondary" className="px-4 py-2">
              <Mic className="h-3 w-3 mr-2" />
              Voice Enabled
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="h-3 w-3 mr-2" />
              4 Languages
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-3 w-3 mr-2" />
              RAG-Verified Data
            </Badge>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tracks.map((track) => (
            <Card
              key={track.id}
              className="hover-elevate active-elevate-2 transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{track.icon}</div>
                  <Badge variant="secondary">{track.badge}</Badge>
                </div>
                <h2 className="text-2xl font-semibold mb-2">{track.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {track.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2">
                  {track.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => setLocation(`/${track.id}`)}
                  className="w-full"
                  data-testid={`button-explore-${track.id}`}
                >
                  Explore {track.badge}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>

        <section className="text-center text-sm text-muted-foreground">
          <p>
            Eylin's personality: empathetic • accurate • helpful
          </p>
        </section>
      </div>
    </div>
  );
}
