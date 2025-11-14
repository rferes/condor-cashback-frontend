import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';

export type User = {
  id: number;
  account_type: string;
  name: string;
  email: string;
  document: string;
  cellphone: string;

  is_legal_entity: boolean;
  is_active: boolean;
  is_premium: boolean;
  is_verified: boolean;
  is_staff: boolean;

  is_terms_comercial_accepted: boolean;
  is_terms_consumer_accepted: boolean;

  date_joined: string;
  groups: { name: string }[];
  invited_by: string;

  merchant: Merchant;
  influencer: Influencer;
  consumer: string;
  manager: string;
};

export type CheckDocumentResponse = {
  document: string;
  type: string;
  status: string;
};

export type UserCreateResponse = {
  access: string;
  refresh: string;
  type: string;
};

export type UserChangeEmailResponse = {
  email: string;
  attempts: string;
  code: string;
  type: string;
};

export type UserChangePasswordResponse = {
  email: string;
  attempts: string;
  code: string;
};

export type UserChangeCellphoneResponse = {
  cellphone: string;
  attempts: string;
  code: string;
};
