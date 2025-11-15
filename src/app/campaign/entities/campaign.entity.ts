import { uuid } from 'uuidv4';
import { StoreGroup } from '../../merchant/store-group/entities/store-group.entity';
import { Collection } from '../../merchant/product-collection/entities/collection.entity';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';
import { ConsumerGroup } from 'src/app/merchant/consumer-group/entities/consumer-group.entity';
import { User } from 'src/app/shared/entities/user.entity';

import { Store } from '../../merchant/store/entities/store.entity';
import { Product } from '../../merchant/product/entities/product.entity';

export type Campaign = {
  id: typeof uuid;
  creator: User;
  creator_mode: string;
  status: string;

  name: string;
  start_date: Date;
  end_date: Date;
  description: string;
  banner: string;

  sponsor: Merchant;
  sponsor_part: number;

  sellers: Merchant[];
  sellers_part: number;
  store_groups: StoreGroup[];

  linked_credit: Merchant;

  dissemination_mode: string;
  member_groups_allow: ConsumerGroup[];
  influencers: Influencer[];

  consumer_groups_allow: ConsumerGroup[];
  consumer_groups_block: ConsumerGroup[];

  campaign_mode: string;
  rule_mode: string;
  collections: Collection[];
  purchase_min_amount: number;
  purchase_max_amount: number;
  participations_maximum_permitted: number;
  maximum_cost_campaign: number;
  remaining_participations: number | null;
  consumer_document_in_receipt: boolean;

  influencer_comission_type: string;
  influencer_comission: number;
  consumer_comission_type: string;
  consumer_comission: number;

  counter_times: number;
  counter_products: number;
  counter_consumers: number;

  total_amount: number;
  cashback_consumer_amount: number;
  cashback_influencer_amount: number;

  credit_provisioning_time: number;

  seller_cnpj_matriz: string;
  consumer_groups_allow_names: string[];
  consumer_groups_block_names: string[];
  stores_groups_names: string[];
  product_eans: string[];

  products: Product[];
  stores: Store[];

  created_date: Date;
  updated_date: Date;
};

export type CampaignInfluencer = {
  id: typeof uuid;
  campaign: Campaign;
  sponsor: Merchant;
  influencer: Influencer;
  document_influencer: string;
  invite_date: Date;
  answer_date: Date;
  start_date: Date;
  end_date: Date;
  status: string;

  created_date: Date;
  updated_date: Date;
};

export type CampaignMerchantStore = {
  id: typeof uuid;
  campaign: Campaign;
  sponsor: Merchant;
  seller: Merchant;
  store_cnpj: string;
  store: Store;
  status: string;
  invite_date: Date;
  answer_date: Date;
  start_date: Date;
  end_date: Date;
  comments: string;
};

export type CampaignConflict = {
  id: typeof uuid;
  sponsor: Merchant;
  existing_campaign: Campaign;
  new_campaign: Campaign;
  store: Store;
  conflict_start_date: Date;
  conflict_end_date: Date;
};
