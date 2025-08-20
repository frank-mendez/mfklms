import { OwnerReference } from './owner';

export interface Stash {
  id: number;
  ownerId: number;
  owner: OwnerReference;
  month: Date;
  amount: number;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStashDTO {
  ownerId: number;
  month: Date;
  amount: number;
  remarks?: string;
}

export interface UpdateStashDTO {
  id: number;
  ownerId: number;
  month: Date;
  amount: number;
  remarks?: string;
}

// Simplified stash interface for use in other entities
export interface StashReference {
  id: number;
  owner: OwnerReference;
  month: Date;
  amount: number;
}
