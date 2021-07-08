import { IChat } from './chat.model';
import { IInbox } from './inbox.model';
import { IUser } from './user.model';

export interface StateStore {
  user: IUser;
  inboxId: string;
  inboxes: IInbox[];
  messages: IChat[];
  contacts: IUser[];
}

export enum UserActions {
  ADD_USER = 'ADD_USER',
  ADD_USERS = 'ADD_USERS',
  REMOVE_USER = 'REMOVE_USER',
  REMOVE_USERS = 'REMOVE_USERS',
}

export enum InboxActions {
  SET_INITIAL_INBOX_STATE = 'SET_INITIAL_INBOX_STATE',
  SET_CURRENT_INBOX = 'SET_CURRENT_INBOX',
  ADD_INBOX = 'ADD_INBOX',
  ADD_INBOXES = 'ADD_INBOXES',
}

export enum MessageActions {
  SET_ALL_MESSAGE = 'SET_ALL_MESSAGE',
  SET_ONE_MESSAGE = 'SET_ONE_MESSAGE',
}

export enum ContactActins {
  SET_ALL_CONTACT = 'SET_ALL_CONTACT',
}
