export interface IChat {
  objectId?: string;
  inboxHash: string;
  senderId: string;
  receiverId: string;
  message: string;
  files?: [string];
  deletedUserId?: string;
  createdAt?: Date;
}

export class Chat {
  objectId?: string;
  inboxHash: string;
  senderId: string;
  receiverId: string;
  message: string;
  files?: [string];
  deletedUserId?: string;
  createdAt?: Date;

  constructor(chat: IChat) {
    this.objectId = chat.objectId;
    this.inboxHash = chat.inboxHash;
    this.senderId = chat.senderId;
    this.receiverId = chat.receiverId;
    this.message = chat.message;
    this.files = chat.files;
    this.deletedUserId = chat.deletedUserId;
    this.createdAt = chat.createdAt;
  }
}
