import { Merchant } from 'src/app/merchant/profile/entities/profile.entity';
import { uuid } from 'uuidv4';

export type Partnership = {
  id: typeof uuid;
  merchant_host: Merchant;
  merchant_guest: Merchant;
  status: string;
};
