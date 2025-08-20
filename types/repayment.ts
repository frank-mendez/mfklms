import { LoanReference } from './loan';

export interface Repayment {
  id: number;
  loanId: number;
  amount: number;
  repaymentDate: Date;
  loan: LoanReference;
}

export interface CreateRepaymentDTO {
  loanId: number;
  amount: number;
  repaymentDate: Date;
}

export interface UpdateRepaymentDTO {
  id: number;
  amount: number;
  repaymentDate: Date;
}

// Simplified repayment interface for use in other entities
export interface RepaymentReference {
  id: number;
  amount: number;
  repaymentDate: Date;
}

// Transaction types related to repayments
export type TransactionType = 'DISBURSEMENT' | 'REPAYMENT';
