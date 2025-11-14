import { uuid } from 'uuidv4';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { Consumer } from 'src/app/merchant/consumer/entities/consumer.entity';
import { User } from 'src/app/shared/entities/user.entity';
import { Wallet } from 'src/app/payment/wallet/wallet-view/entities/wallet.entity';
import { CreditCard } from 'src/app/payment/credit-card/entities/credit-card.entity';
import { PixKey } from 'src/app/payment/pix-key/entities/pix-key.entity';

export type Transaction = {
  id: typeof uuid;
  user: User;
  document: string;
  seller: Merchant;
  wallet: Wallet;
  influencer: Influencer;
  consumer: Consumer;
  mode: 'IN' | 'OUT';
  action_type:
    | 'SUBSCRIPTION_INFLUENCER'
    | 'SUBSCRIPTION_MERCHANT'
    | 'ADD_RED_CREDITS'
    | 'COMISSION_INFLUENCER'
    | 'CASHBACK_CONSUMER';
  status:
    | 'new'
    | 'created'
    | 'registered'
    | 'processing'
    | 'success'
    | 'failed'
    | 'refused'
    | 'canceled'
    | 'refunded';

  credit_card: CreditCard;
  lasts_4_digits_cc: string;
  pix: PixKey;
  pix_code: string;
  amount: number;
  description: string;
  transaction_time: Date;
  red_credits: number;
  created_date: Date;
  updated_date: Date;
};
