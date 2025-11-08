import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface SanctionLetterProps {
  applicantName: string;
  loanType: string;
  amount: string;
  interestRate: string;
  tenure: string;
  onDownload?: () => void;
}

export default function SanctionLetter({
  applicantName,
  loanType,
  amount,
  interestRate,
  tenure,
  onDownload,
}: SanctionLetterProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-6xl animate-in zoom-in duration-500">
          🎉
        </div>
      )}
      
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div>
            <Badge className="mb-2" variant="default">
              Approved
            </Badge>
            <h2 className="text-2xl font-semibold">
              Congratulations, {applicantName}!
            </h2>
            <p className="text-muted-foreground text-sm mt-2">
              Your {loanType} has been approved
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Loan Amount</span>
              <span className="font-semibold">{amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Interest Rate</span>
              <span className="font-semibold">{interestRate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Tenure</span>
              <span className="font-semibold">{tenure}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
            <FileText className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">Sanction Letter</p>
              <p className="text-xs text-muted-foreground">
                Official approval document
              </p>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => {
              console.log("Downloading sanction letter");
              onDownload?.();
            }}
            className="w-full"
            data-testid="button-download-sanction"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Sanction Letter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
