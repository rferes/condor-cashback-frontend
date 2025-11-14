import { uuid } from 'uuidv4';

export type Consumer = {
  id: typeof uuid;
  document: string;
  is_active: boolean;
  city: string;
  cep: string;
};
