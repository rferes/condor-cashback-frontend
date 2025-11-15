import { uuid } from 'uuidv4';
import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { Influencer } from 'src/app/influencer/profile/entities/profile.entity';

export type MerchantInfluencerFriendship = {
  id: typeof uuid;
  merchant: Merchant;
  influencer: Influencer;
  status: string;
  created_date: Date;
  updated_date: Date;
};
