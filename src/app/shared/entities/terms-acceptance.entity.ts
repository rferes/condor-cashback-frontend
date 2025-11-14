export type TermsAcceptance = {
  id?: number;
  terms_version: string;
  acceptance_type:
    | 'consumer_terms'
    | 'privacy_policy'
    | 'merchant_terms'
    | 'influencer_terms';
  acceptance_type_display?: string;
  acceptance_date?: string;
  ip_address?: string;
  user_agent?: string;
};
