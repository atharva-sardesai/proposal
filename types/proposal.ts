export interface Scope {
  serviceType: string;
  description?: string;
  deliverables?: string;
  timeline?: string;
}

export interface ProposalData {
  company: {
    name: string;
    address: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  dates: {
    startDate: string;
    endDate: string;
  };
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  engagement: {
    type: "one-time" | "ongoing" | "retainer";
    details?: string;
  };
  financials: {
    quotedAmount: string;
    paymentTerms: string;
    currency: string;
  };
  compliance?: {
    requirements?: string[];
    details?: string;
  };
  scopes?: Scope[];
} 