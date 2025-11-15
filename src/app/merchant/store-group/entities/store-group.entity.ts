import { uuid } from 'uuidv4';
import { Store } from '../../store/entities/store.entity';

export type StoreGroup = {
  id: typeof uuid;
  name: string;
  seller: string;
  stores: Store[];
};
