import { uuid } from 'uuidv4';
import { User } from 'src/app/shared/entities/user.entity';
import { Transaction } from 'src/app/payment/transaction/entities/transaction.entity';
import { CampaignCredit } from 'src/app/payment/campaign-credit/entities/campaign-credit.entity';
import { Receipt } from 'src/app/receipt/entities/receipt.entity';

export type RedComission = {
  id: typeof uuid;
  user: User;
  campaign_credit_origin: CampaignCredit;
  initial_amount: number;
  amount: number;
  status: string;
  transaction: Transaction[];
  receipt: Receipt;
  user_mode: string;
  expiration_date: Date;
  credit_grant_date: Date;
  created_date: Date;
};
