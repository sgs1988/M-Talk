import { IChat } from '../models/chat.model';

export interface IMessages {
  [key: string]: IChat[];
}
