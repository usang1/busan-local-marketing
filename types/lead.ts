export type LeadType = "free_audit" | "consultation";

export type LeadStatus =
  | "new"
  | "contacted"
  | "consulting"
  | "proposal"
  | "contracted"
  | "on_hold"
  | "rejected";

export type LeadPayload = {
  leadType: LeadType;
  businessName: string;
  contactName: string;
  phone: string;
  industry: string;
  region: string;
  placeUrl?: string;
  budget?: string;
  currentMarketing?: string;
  concerns?: string;
  interestedServices?: string[];
  competitor?: string;
  preferredContactTime?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
  privacyConsent: boolean;
  companyWebsite?: string;
  formStartedAt?: string;
};
