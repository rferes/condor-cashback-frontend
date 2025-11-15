import { uuid } from 'uuidv4';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Transaction } from 'src/app/payment/transaction/entities/transaction.entity';

export type CampaignCredit = {
  id: typeof uuid;
  merchant: Merchant;
  initial_amount: number;
  amount: number;
  status: string;
  transaction: Transaction;
  expiration_date: Date;
};
