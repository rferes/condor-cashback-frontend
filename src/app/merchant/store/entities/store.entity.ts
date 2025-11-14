import { uuid } from 'uuidv4';
import { Address } from 'src/app/shared/entities/address.entity';

export type Store = {
  id: typeof uuid;
  name: string;
  document: string;
  address: Address;
  // store_image: string | null;
  // password: string;
  is_active: boolean;
  seller: typeof uuid;
};
