import { uuid } from 'uuidv4';
import { City } from 'src/app/shared/entities/address.entity';

export type Influencer = {
  id: typeof uuid;
  document: string;
  url: string;
  name: string;
  is_active: boolean;
  image: string;
  type: string;
  commercial_category: string;
  city: City;
  cep: string;
  birth_date: Date;
  gender: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
  twitch: string;
  snapchat: string;
  website: string;
  created_date: Date;
};
