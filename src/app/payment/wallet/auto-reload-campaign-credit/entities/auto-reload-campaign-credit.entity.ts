import { uuid } from 'uuidv4';
import { CreditCard } from 'src/app/payment/credit-card/entities/credit-card.entity';

export type AutoReloadCampaignCredit = {
  id: typeof uuid;
  auto_reload: boolean;
  last_recharge: string;
  last_recharged: Date;
  min_balance: string;
  add_balance: string;
  system_min_balance: string;
  system_add_balance: string;
  credit_card: CreditCard;
};
