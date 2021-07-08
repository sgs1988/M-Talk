import { IPointer } from './common.model';

export interface IInbox {
  objectId?: string;
  userId: string; // the owner of the inbox
  senderId: string;
  sender: IPointer;
  lastMessage: string;
  inboxHash: string;
  deleted: boolean;
  updatedAt?: Date;
}

export class Inbox {
  objectId?: string;
  userId: string;
  senderId: string;
  sender: IPointer;
  lastMessage: string;
  inboxHash: string;
  deleted: boolean;
  updatedAt?: Date;

  constructor(inbox: IInbox) {
    this.objectId = inbox.objectId;
    this.userId = inbox.userId;
    this.senderId = inbox.senderId;
    this.sender = inbox.sender;
    this.lastMessage = inbox.lastMessage;
    this.inboxHash = inbox.inboxHash;
    this.deleted = inbox.deleted;
    this.updatedAt = inbox.updatedAt;
  }
}
