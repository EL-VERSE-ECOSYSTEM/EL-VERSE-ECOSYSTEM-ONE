export type UserRole = 'learner' | 'tutor' | 'freelancer' | 'client' | 'intern' | 'company' | 'admin';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  tutor_id: string;
  status: 'draft' | 'published' | 'archived';
  price: number;
  created_at: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  poster_id: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  cover_letter: string;
  bid: number;
  status: 'submitted' | 'accepted' | 'rejected';
}

export interface Transaction {
  id: string;
  user_id: string;
  provider: 'paystack';
  reference: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

export interface Workflow {
  id: string;
  owner_id: string;
  name: string;
  definition: Record<string, any>;
  enabled: boolean;
}

export interface CRMLead {
  id: string;
  name: string;
  email: string;
  source: string;
  status: string;
  score: number;
}

export interface Dispute {
  id: string;
  contract_id: string;
  raised_by: string;
  status: 'open' | 'under_review' | 'resolved';
  resolution?: string;
}
