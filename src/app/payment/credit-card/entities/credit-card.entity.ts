import { uuid } from 'uuidv4';
import { User } from 'src/app/shared/entities/user.entity';

export type CreditCard = {
  id: typeof uuid;
  user: User;
  document: string;
  status: string;
  last_four_digits: string;
  cardId: string;
};
