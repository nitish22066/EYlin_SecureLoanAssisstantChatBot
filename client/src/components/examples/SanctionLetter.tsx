import SanctionLetter from "../SanctionLetter";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function SanctionLetterExample() {
  return (
    <LanguageProvider>
      <div className="max-w-md mx-auto p-6">
        <SanctionLetter
          applicantName="Nitish"
          loanType="Car Loan"
          amount="₹7,00,000"
          interestRate="10.5%"
          tenure="48 months"
        />
      </div>
    </LanguageProvider>
  );
}
