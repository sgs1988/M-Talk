import { IChat } from '../models/chat.model';

export interface IMessages {
  [key: string]: IChat[];
}

export interface GMessages {
  [key: string]: any[];
}
