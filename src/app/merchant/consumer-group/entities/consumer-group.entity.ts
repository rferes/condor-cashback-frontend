import { uuid } from 'uuidv4';

export type ConsumerGroup = {
  id: typeof uuid;
  name: string;
  merchant: string;
  description: string;
  quantity: number;
  created_date: string;
  updated_date: string;
  // document_list: string[];
};
