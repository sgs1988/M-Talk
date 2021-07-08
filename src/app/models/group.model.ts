export interface GroupMember {
  memberId: string;
  memberName: string;
}

export interface GInbox {
  objectId?: string;
  userId?: string; // the owner of the inbox
  senderId?: string;
  sender: {
    objectId?: string;
    groupname?: string;
    description?:string;
    members?: Array<GroupMember>;
  };
  lastMessage?: string;
  inboxHash?: string;
  deleted?: boolean;
}

export class GroupInbox {
  objectId?: string;
  userId?: string; // the owner of the inbox
  senderId?: string;
  sender: {
    objectId?: string;
    groupname?: string;
    description?:string;
    groupMember?: Array<GroupMember>;
  };
  lastMessage?: string;
  inboxHash?: string;
  deleted?: boolean;

  constructor(inbox: GInbox) {
    this.objectId = inbox.objectId;
    this.userId = inbox.userId;
    this.senderId = inbox.senderId;
    this.sender = inbox.sender;
    this.lastMessage = inbox.lastMessage;
    this.inboxHash = inbox.inboxHash;
    this.deleted = inbox.deleted;
  }
}
