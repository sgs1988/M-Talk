import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Chat, IChat } from '../models/chat.model';
import { IInbox } from '../models/inbox.model';
import { MessageActions, StateStore } from '../models/store.model';
import { IUser } from '../models/user.model';
import { HttpService } from './http.service';
import { SocketIoService } from './socket-io.service';

@Injectable({ providedIn: 'root' })
export class GroupService extends ObservableStore<StateStore> {
  messages = new BehaviorSubject<IChat[] | null>(null);
  fetchedMessages: IChat[] = [];
  inboxes: IInbox[] = [];
  isSubscribed = false;

  constructor(private http: HttpService, private socket: SocketIoService) {
    super({});
  }

  async createGroups(message: string, inbox: IInbox, user: IUser) {
    const pushData = {
      userId: inbox.senderId,
      userName: `${user.firstName} ${user.lastName}`,
      message,
    };

    await this.http
      .post('functions/createGroups', pushData)
      .toPromise();
  }
}
