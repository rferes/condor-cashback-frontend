import { uuid } from 'uuidv4';
import { Product } from '../../product/entities/product.entity';

export type Collection = {
  id: typeof uuid;
  name: string;
  seller: string;
  products: Product[];
};
