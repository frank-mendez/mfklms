import { LoanReference } from './loan';
import { TransactionType } from './repayment';

export interface Transaction {
  id: number;
  loanId: number;
  loan: LoanReference;
  transactionType: TransactionType;
  amount: number;
  date: Date;
  createdAt: Date;
}

export interface CreateTransactionDTO {
  loanId: number;
  transactionType: TransactionType;
  amount: number;
  date: Date;
}

export interface UpdateTransactionDTO {
  id: number;
  transactionType: TransactionType;
  amount: number;
  date: Date;
}

// Simplified transaction interface for use in other entities
export interface TransactionReference {
  id: number;
  transactionType: TransactionType;
  amount: number;
  date: Date;
}

// Re-export TransactionType for convenience
export type { TransactionType } from './repayment';
