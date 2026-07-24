// types/index.ts

export type UserRole = 'PUBLIC_COMPLAINANT' | 'LAWYER' | 'POLICE_OFFICER';

export interface ComplaintFormInput {
  complainantName: string;
  contactEmail: string;
  incidentDate: string;
  incidentLocation: string;
  description: string;
  hasWeapons: boolean;
  hasStrangulation: boolean;
  hasStalking: boolean;
  threatsToKill: boolean;
  evidenceFiles?: FileList | null;
}

export interface FeatureCard {
  title: string;
  description: string;
  badge: string;
  icon: string;
}

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
}