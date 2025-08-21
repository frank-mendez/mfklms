import { LoanReference } from './loan';

export interface Repayment {
  id: number;
  loanId: number;
  dueDate: Date;
  amountDue: number;
  amountPaid?: number;
  paymentDate?: Date;
  status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED';
  loan: LoanReference;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRepaymentDTO {
  loanId: number;
  dueDate: Date;
  amountDue: number;
}

export interface UpdateRepaymentDTO {
  id: number;
  amountDue?: number;
  amountPaid?: number;
  dueDate?: Date;
  paymentDate?: Date;
  status?: 'PENDING' | 'PAID' | 'LATE' | 'MISSED';
}

// Simplified repayment interface for use in other entities
export interface RepaymentReference {
  id: number;
  amountDue: number;
  dueDate: Date;
  status: 'PENDING' | 'PAID' | 'LATE' | 'MISSED';
}

// Transaction types related to repayments
export type TransactionType = 'DISBURSEMENT' | 'REPAYMENT';
