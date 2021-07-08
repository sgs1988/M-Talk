import { IPointer } from './common.model';

export interface INewsLetter {
  userId: string;
  user: IPointer;
  subs: PushSubscription;
}
