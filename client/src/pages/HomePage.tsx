import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mic, Globe, Shield } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@assets/generated_images/Dual_track_banking_illustration_f80fafab.png";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

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
            {t("app.title")}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            {t("app.subtitle")}
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
              {t("badge.voice")}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Globe className="h-3 w-3 mr-2" />
              {t("badge.languages")}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-3 w-3 mr-2" />
              {t("badge.security")}
            </Badge>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="hover-elevate active-elevate-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">🏢</div>
                <Badge variant="secondary">{t("badge.voice").split(" ")[0]}</Badge>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t("track1.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("track1.desc")}
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track1.benefit1")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track1.benefit2")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track1.benefit3")}</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => setLocation("/track1")}
                className="w-full"
                data-testid="button-explore-track1"
              >
                {t("button.explore")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover-elevate active-elevate-2 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="text-5xl">🌱</div>
                <Badge variant="secondary">{t("badge.voice").split(" ")[0]}</Badge>
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t("track2.title")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("track2.desc")}
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track2.benefit1")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track2.benefit2")}</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{t("track2.benefit3")}</span>
                </li>
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                onClick={() => setLocation("/track2")}
                className="w-full"
                data-testid="button-explore-track2"
              >
                {t("button.explore")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="text-center text-sm text-muted-foreground">
          <p>{t("personality")}</p>
        </section>
      </div>
    </div>
  );
}
