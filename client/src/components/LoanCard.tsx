import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface LoanCardProps {
  icon: string;
  type: string;
  title: string;
  description: string;
  amount?: string;
  interestRate?: string;
  tenure?: string;
  onApply: () => void;
}

export default function LoanCard({
  icon,
  type,
  title,
  description,
  amount,
  interestRate,
  tenure,
  onApply,
}: LoanCardProps) {
  return (
    <Card className="hover-elevate active-elevate-2 transition-all duration-300">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-4">
        <div className="text-4xl">{icon}</div>
        <Badge variant="secondary">{type}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        {(amount || interestRate || tenure) && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {amount && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Amount</p>
                <p className="text-sm font-medium">{amount}</p>
              </div>
            )}
            {interestRate && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
                <p className="text-sm font-medium">{interestRate}</p>
              </div>
            )}
            {tenure && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground mb-1">Tenure</p>
                <p className="text-sm font-medium">{tenure}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={onApply}
          className="w-full"
          data-testid={`button-apply-${type.toLowerCase()}`}
        >
          Apply Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
