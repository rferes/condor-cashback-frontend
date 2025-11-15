import { uuid } from 'uuidv4';
import { Consumer } from 'src/app/merchant/consumer/entities/consumer.entity';
import { Transaction } from 'src/app/payment/transaction/entities/transaction.entity';
import { Campaign } from 'src/app/campaign/entities/campaign.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import {
  Product,
  ProductLog,
} from 'src/app/merchant/product/entities/product.entity';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Store } from 'src/app/merchant/store/entities/store.entity';

export type Receipt = {
  id: typeof uuid;
  consumer: Consumer;
  consumer_document: string;
  consumer_pix_code: string;
  consumer_pix_type: 'CPF' | 'CELLPHONE' | 'EMAIL';

  dissemination_mode: 'INFLUENCER' | 'MEMBER';
  member: Consumer;
  member_document: string;
  member_pix_code: string;
  member_pix_type?: 'CPF' | 'CELLPHONE' | 'EMAIL';
  influencer: Influencer;
  influencer_document: string;

  sponsor: Merchant;
  sponsor_cnpj: string;
  linked_credit: Merchant;
  seller: Merchant;
  seller_cnpj: string;

  detection_type: 'TYPED' | 'QRCODE';
  access_key: string;

  store: Store;
  cnpj: string;
  campaign: Campaign;
  receipt_value: number;
  promocional_receipt_value: number;
  cashback_value_consumer: number;
  comission_value_influencer: number;
  tax_redads_value: number;

  status:
    | 'NEW'
    | 'CHECKING'
    | 'NOT_FOUND'
    | 'REJECTED_DONT_HAVE_CAMPAIGN'
    | 'REJECTED_DONT_HAVE_PRODUCT_CAMPAIGN'
    | 'REJECTED_EMISSION_DATE_NOT_ALLOW'
    | 'REJECTED_STORE_NOT_FOUND'
    | 'REJECTED_CONSUMER_BLOCK'
    | 'REJECTED_CONSUMER_NOT_ALLOW'
    | 'REPROVED_LIMIT_PARTICIPATIONS_EXCEEDED'
    | 'REPROVED_MINIMUM_VALUE'
    | 'REPROVED_MINIMUM_QUANTITY'
    | 'REPROVED_BY_SELLER'
    | 'APPROVED'
    | 'PIX_NOT_FOUND'
    | 'PENDINGPAYMENT'
    | 'PAID'
    | 'PAYMENT_FAILED';
  status_payment_influencer:
    | 'INVALID'
    | 'PROVISIONED'
    | 'GRANTED'
    | 'PAID'
    | 'FAILED'
    | 'CANCELED'
    | 'REFUNDED'
    | 'EXPIRED';
  products_log: ProductLog[];
  comment: string;
  next_check: Date;
  emission_date: Date;
  transaction: Transaction;
  created_at: Date;
  updated_at: Date;
  products_quantity: number;
  promocional_products_quantity: number;
};

export type Receipt_In = {
  id: typeof uuid;
  access_key: string;
  status: string;
};

export type Receipt_Out = {
  access_key: string;
  emission_date: Date;
  receipt_value: number;
  consumer_id: typeof uuid;
  consumer_document: string;
  consumer_pix_code: string;
  consumer_pix_type: string;
  influencer_id: typeof uuid;
  influencer_name: string;
  influencer_document: string;

  seller_id: typeof uuid;
  seller_name: string;
  seller_document: string;
  store_id: typeof uuid;
  store_name: string;
  store_document: string;
  store_address: string;
  store_city: string;
  store_state: string;
  list_campaigns_names: [];
  list_of_linked_credits: [];
};
