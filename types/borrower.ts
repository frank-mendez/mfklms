export interface Borrower {
  id: number;
  name: string;
  contactInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBorrowerData {
  name: string;
  contactInfo?: string;
}

export interface UpdateBorrowerData extends CreateBorrowerData {
  id: number;
}

// Simplified borrower interface for use in other entities
export interface BorrowerReference {
  id: number;
  name: string;
}