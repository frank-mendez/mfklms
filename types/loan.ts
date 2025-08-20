import { BorrowerReference } from './borrower';

export interface Loan {
  id: number;
  borrowerId: number;
  borrower: BorrowerReference;
  principal: number;
  interestRate: number;
  startDate: string;
  maturityDate: string | null;
  status: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoanData {
  borrowerId: number;
  principal: number;
  interestRate: number;
  startDate: string;
  maturityDate?: string;
}

export interface UpdateLoanData extends Partial<CreateLoanData> {
  id: number;
  status?: 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
}

// Simplified loan interface for use in other entities
export interface LoanReference {
  id: number;
  borrower: BorrowerReference;
}

// Loan status type for reuse
export type LoanStatus = 'ACTIVE' | 'CLOSED' | 'DEFAULTED';
