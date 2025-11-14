import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';

export type MerchantApiKey = {
  id: string; // UUID
  merchant: Merchant;
  name: string;
  description?: string;
  public_key: string;
  private_key: string;
  permissions: Record<string, any>;
  createdAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
  status: 'active' | 'revoked' | 'expired';
};

export interface CreateKeyRequest {
  name: string;
  description?: string;
  days_valid?: number;
}
