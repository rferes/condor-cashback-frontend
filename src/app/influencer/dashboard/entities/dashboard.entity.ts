import { uuid } from 'uuidv4';

export type DashboardInfluencer = {
  receipts_qnt: number;
  receipts_value: number;
  receipts_avg_value: number;
  products_qnt: number;
  products_value: number;
  products_avg_value: number;
  consumers_qnt: number;
  consumers_value: number;
  consumers_avg_value: number;
  sponsors_qnt: number;
  sponsors_value: number;
  sponsors_avg_value: number;
  stores_qnt: number;
  stores_value: number;
  stores_avg_value: number;
  campaigns_qnt: number;
  campaigns_value: number;
  campaigns_avg_value: number;
};
