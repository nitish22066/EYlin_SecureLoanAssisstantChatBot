import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import LoanCard from "@/components/LoanCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface TrackPageProps {
  trackId: "track1" | "track2";
}

export default function TrackPage({ trackId }: TrackPageProps) {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const track1Loans = [
    {
      icon: "🚗",
      type: t("loan.car"),
      title: t("loan.car.title"),
      description: t("loan.car.desc"),
      amount: `${t("upto")} ₹15 ${t("badge.voice").includes("Lakhs") ? "Lakhs" : ""}`,
      interestRate: "10.5% p.a.",
      tenure: "12-60 months",
      route: "/conversation/car-loan",
    },
    {
      icon: "🎓",
      type: t("loan.education"),
      title: t("loan.education.title"),
      description: t("loan.education.desc"),
      amount: `${t("upto")} ₹20 Lakhs`,
      interestRate: "11.0% p.a.",
      tenure: "12-84 months",
      route: "/conversation/education-loan",
    },
    {
      icon: "💼",
      type: t("loan.business"),
      title: t("loan.business.title"),
      description: t("loan.business.desc"),
      amount: `${t("upto")} ₹50 Lakhs`,
      interestRate: "12.5% p.a.",
      tenure: "12-60 months",
      route: "/conversation/business-loan",
    },
    {
      icon: "💡",
      type: t("loan.other"),
      title: t("loan.other.title"),
      description: t("loan.other.desc"),
      amount: t("varies"),
      interestRate: t("competitive"),
      tenure: t("flexible"),
      route: "/conversation/other-loan",
    },
  ];

  const track2Loans = [
    {
      icon: "🛵",
      type: t("loan.twowheeler"),
      title: t("loan.twowheeler.title"),
      description: t("loan.twowheeler.desc"),
      amount: "₹50,000 - ₹2 Lakhs",
      interestRate: "13.5% p.a.",
      tenure: "12-36 months",
      route: "/conversation/two-wheeler-loan",
    },
    {
      icon: "🏠",
      type: t("loan.home"),
      title: t("loan.home.title"),
      description: t("loan.home.desc"),
      amount: "₹1 Lakh - ₹10 Lakhs",
      interestRate: "14.0% p.a.",
      tenure: "12-48 months",
      route: "/conversation/home-improvement",
    },
    {
      icon: "💰",
      type: t("loan.personal"),
      title: t("loan.personal.title"),
      description: t("loan.personal.desc"),
      amount: "₹50,000 - ₹5 Lakhs",
      interestRate: "14.5% p.a.",
      tenure: "12-36 months",
      route: "/conversation/personal-loan",
    },
    {
      icon: "💡",
      type: t("loan.other"),
      title: t("loan.other.title"),
      description: t("loan.other.desc"),
      amount: t("varies"),
      interestRate: t("competitive"),
      tenure: t("flexible"),
      route: "/conversation/other-loan",
    },
  ];

  const loans = trackId === "track1" ? track1Loans : track2Loans;
  const trackTitle = trackId === "track1" ? t("track1.title") : t("track2.title");

  return (
    <div className="min-h-screen bg-background">
      <VoiceLanguageControls />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2" data-testid="text-track-title">
              {trackTitle}
            </h1>
            <p className="text-muted-foreground">
              {t("track.select")}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            data-testid="button-home"
          >
            <Home className="mr-2 h-4 w-4" />
            {t("button.home")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loans.map((loan, index) => (
            <LoanCard
              key={index}
              icon={loan.icon}
              type={loan.type}
              title={loan.title}
              description={loan.description}
              amount={loan.amount}
              interestRate={loan.interestRate}
              tenure={loan.tenure}
              onApply={() => setLocation(loan.route)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-return-menu"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            {t("button.return")}
          </Button>
        </div>
      </div>
    </div>
  );
}
