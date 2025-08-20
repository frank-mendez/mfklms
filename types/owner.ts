export interface Owner {
  id: number;
  name: string;
  contactInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOwnerDTO {
  name: string;
  contactInfo?: string;
}

export interface UpdateOwnerDTO {
  id: number;
  name: string;
  contactInfo?: string;
}

// Simplified owner interface for use in other entities
export interface OwnerReference {
  id: number;
  name: string;
}
