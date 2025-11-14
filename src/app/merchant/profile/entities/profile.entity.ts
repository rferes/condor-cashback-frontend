import { City } from 'src/app/shared/entities/address.entity';
import { uuid } from 'uuidv4';

export type Merchant = {
  id: typeof uuid;
  document: string;
  name: string;
  url: string;
  is_active: boolean;
  image: string;
  type: string;
  commercial_category: string;
  cep: string;
  city: City;
  google_play_store_url: string;
  app_store_url: string;
  created_date: Date;
};
