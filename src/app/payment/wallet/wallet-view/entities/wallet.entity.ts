import { uuid } from 'uuidv4';
import { User } from 'src/app/shared/entities/user.entity';
import { AutoReloadCampaignCredit } from 'src/app/payment/wallet/auto-reload-campaign-credit/entities/auto-reload-campaign-credit.entity';

export type Wallet = {
  id: typeof uuid;
  campaign_credit_auto_reload: AutoReloadCampaignCredit;
  user: User;
  red_credits_provisional: number;
  red_credits_granted: number;
  red_credits_redeemed: number;
  red_credits_expired: number;
  red_credits_processing_transaction: number;
  red_comission_provisional: number;
  red_comission_granted: number;
  red_comission_redeemed: number;
  red_comission_expired: number;
  red_comission_processing_transaction: number;
  campaign_credits_provisional: number;
  campaign_credits_granted: number;
  campaign_credits_used: number;
  campaign_credits_expired: number;
  campaign_credits_processing_transaction: number;
};

export type Wallet_expiron_soon = {
  red_credits_expiring_soon: number;
  red_comission_expiring_soon: number;
  campaign_credits_expiring_soon: number;
  campaign_credits_transferred: number;
};
