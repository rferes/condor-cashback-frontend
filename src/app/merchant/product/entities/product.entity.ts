import { uuid } from 'uuidv4';

export type Product = {
  id: typeof uuid;
  name: string;
  is_active: boolean;
  description: string;
  product_eans: JSON;
  category: string;
  seller: typeof uuid;
};

export type ProductLog = {
  id: typeof uuid;
  description: string;
  quantity: number;
  total_value: number;
  unit_value: number;
  product_code: string;
  code_ncm: string;
  cfop: string;
  ean: string;
  cest: string;
  unit_code: string;
  taxes: number;
  campaign: typeof uuid;
};
