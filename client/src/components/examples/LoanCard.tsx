import LoanCard from "../LoanCard";

export default function LoanCardExample() {
  return (
    <div className="max-w-sm mx-auto p-6">
      <LoanCard
        icon="🚗"
        type="Car Loan"
        title="Vehicle Finance"
        description="Get your dream car with flexible repayment options and competitive interest rates."
        amount="Up to ₹15 Lakhs"
        interestRate="10.5% p.a."
        tenure="12-60 months"
        onApply={() => console.log("Apply clicked")}
      />
    </div>
  );
}
