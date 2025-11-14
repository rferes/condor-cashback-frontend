import { uuid } from 'uuidv4';

export type ComercialCategory = {
  id: typeof uuid;
  name: string;
  setor: string;
};
