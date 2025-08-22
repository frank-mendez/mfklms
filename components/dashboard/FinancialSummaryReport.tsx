import { ContributionIcon, LoanIcon, RepaymentIcon, WalletIcon } from '@/assets/icons';
import { formatCurrency } from '@/utils/common/currency';
import { useFinancialSummary } from '@/react-query/dashboard';

interface FinancialSummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  iconBgColor: string;
  isPositive?: boolean;
}

const FinancialSummaryCard = ({ 
  title, 
  amount, 
  icon, 
  iconBgColor, 
  isPositive = true 
}: FinancialSummaryCardProps) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-base-content/70">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            isPositive ? 'text-success' : amount < 0 ? 'text-error' : 'text-base-content'
          }`}>
            {formatCurrency(amount)}
          </p>
        </div>
        <div className={`p-3 rounded-full ${iconBgColor}`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);

export const FinancialSummaryReport = () => {
  const { data: financialSummary, isLoading, error } = useFinancialSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-base-300 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-base-300 rounded w-24"></div>
                  </div>
                  <div className="w-12 h-12 bg-base-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error mb-8">
        <span>Failed to load financial summary. Please try again later.</span>
      </div>
    );
  }

  if (!financialSummary) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Financial Summary Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialSummaryCard
          title="Total Contributions"
          amount={Number(financialSummary.totalContributions)}
          icon={<ContributionIcon className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          isPositive={true}
        />
        
        <FinancialSummaryCard
          title="Total Loans (Principal)"
          amount={Number(financialSummary.totalLoans)}
          icon={<LoanIcon className="h-6 w-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
          isPositive={false}
        />
        
        <FinancialSummaryCard
          title="Total Repayments"
          amount={Number(financialSummary.totalRepayments)}
          icon={<RepaymentIcon className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
          isPositive={true}
        />
        
        <FinancialSummaryCard
          title="Amount on Hand"
          amount={Number(financialSummary.amountOnHand)}
          icon={<WalletIcon className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
          isPositive={financialSummary.amountOnHand >= 0}
        />
      </div>
    </div>
  );
};
