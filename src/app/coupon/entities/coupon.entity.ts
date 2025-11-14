import { uuid } from 'uuidv4';
import { Consumer } from 'src/app/merchant/consumer/entities/consumer.entity';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';

export type Coupon = {
  id: typeof uuid;
  consumer: Consumer;
  status: string;
  used_date: Date;
  expiration_date: Date;
  created_date: Date;
  updated_date: Date;
  red_credit_amount: number;
  coupon_amount: number;
  merchant: Merchant;
  origin: Record<string, number>;
  consumer_document: string;
  merchant_document: string;
};
