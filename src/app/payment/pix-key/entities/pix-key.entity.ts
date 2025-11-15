import { uuid } from 'uuidv4';
import { User } from 'src/app/shared/entities/user.entity';

export type PixKey = {
  id: typeof uuid;
  user: User;
  type: 'CPF' | 'CNPJ' | 'EMAIL' | 'CELLPHONE';
  account_number: string;
  account_type: string;
  branch_code: string;
  bank_name: string;
  ispb: string;
  name: string;
  owner_type: string;
  status: string;
  pix_key: string;
  tax_id: string;
  status_redred: 'ACTIVE' | 'INACTIVE';
};
