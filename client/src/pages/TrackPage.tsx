import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight } from "lucide-react";
import VoiceLanguageControls from "@/components/VoiceLanguageControls";
import LoanCard from "@/components/LoanCard";

interface TrackPageProps {
  trackId: "track1" | "track2";
}

export default function TrackPage({ trackId }: TrackPageProps) {
  const [, setLocation] = useLocation();

  const track1Loans = [
    {
      icon: "🚗",
      type: "Car Loan",
      title: "Vehicle Finance",
      description:
        "Get your dream car with flexible repayment options and competitive interest rates.",
      amount: "Up to ₹15 Lakhs",
      interestRate: "10.5% p.a.",
      tenure: "12-60 months",
      route: "/conversation/car-loan",
    },
    {
      icon: "🎓",
      type: "Education Loan",
      title: "Education Finance",
      description:
        "Invest in your future with our education loans for courses and institutions worldwide.",
      amount: "Up to ₹20 Lakhs",
      interestRate: "11.0% p.a.",
      tenure: "12-84 months",
      route: "/conversation/education-loan",
    },
    {
      icon: "💼",
      type: "Business Loan",
      title: "Business Expansion",
      description:
        "Grow your business with quick approvals and minimal documentation requirements.",
      amount: "Up to ₹50 Lakhs",
      interestRate: "12.5% p.a.",
      tenure: "12-60 months",
      route: "/conversation/business-loan",
    },
    {
      icon: "💡",
      type: "Other Loans",
      title: "Other Loan Types",
      description:
        "Explore additional loan products tailored to your specific needs and requirements.",
      amount: "Varies",
      interestRate: "Competitive rates",
      tenure: "Flexible terms",
      route: "/conversation/other-loan",
    },
  ];

  const track2Loans = [
    {
      icon: "🛵",
      type: "Two-Wheeler Loan",
      title: "Two-Wheeler Finance",
      description:
        "Affordable financing for bikes and scooters with easy EMI options.",
      amount: "₹50,000 - ₹2 Lakhs",
      interestRate: "13.5% p.a.",
      tenure: "12-36 months",
      route: "/conversation/two-wheeler-loan",
    },
    {
      icon: "🏠",
      type: "Home Improvement",
      title: "Home Renovation",
      description:
        "Quick loans for home repairs, renovations, and improvements.",
      amount: "₹1 Lakh - ₹10 Lakhs",
      interestRate: "14.0% p.a.",
      tenure: "12-48 months",
      route: "/conversation/home-improvement",
    },
    {
      icon: "💰",
      type: "Personal Loan",
      title: "Personal Finance",
      description:
        "Flexible personal loans for medical, wedding, or emergency needs.",
      amount: "₹50,000 - ₹5 Lakhs",
      interestRate: "14.5% p.a.",
      tenure: "12-36 months",
      route: "/conversation/personal-loan",
    },
    {
      icon: "💡",
      type: "Other Loans",
      title: "Other Loan Types",
      description:
        "Explore additional loan products tailored to your specific needs and requirements.",
      amount: "Varies",
      interestRate: "Competitive rates",
      tenure: "Flexible terms",
      route: "/conversation/other-loan",
    },
  ];

  const loans = trackId === "track1" ? track1Loans : track2Loans;
  const trackTitle =
    trackId === "track1"
      ? "Metro Profit Loans"
      : "Tier 2 Micro-Loans";

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
              Select a loan type to start your application
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
            data-testid="button-home"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
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
            Return to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}
