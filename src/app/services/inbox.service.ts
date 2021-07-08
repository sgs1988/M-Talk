import { Injectable } from '@angular/core';
import { IInbox, Inbox } from '../models/inbox.model';
import { IUser } from '../models/user.model';
import { HttpService } from './http.service';
import { v4 } from 'uuid';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ObservableStore } from '@codewithdan/observable-store';
import { InboxActions, StateStore } from '../models/store.model';
import { Router } from '@angular/router';
import { SocketIoService } from './socket-io.service';

@Injectable({ providedIn: 'root' })
export class InboxService extends ObservableStore<StateStore> {
  private isSubscribed = false;

  constructor(
    private http: HttpService,
    private router: Router,
    private socket: SocketIoService,
  ) {
    super({});

    this.socket.on('Inbox', (inbox: any) => {
      if (!inbox) {
        return;
      }

      let { inboxes } = this.getState();

      inboxes = inboxes.map((inb) => {
        if (inb.objectId === inbox.object.objectId) {
          return {
            ...inb,
            lastMessage: inbox.object.lastMessage,
          };
        }

        return inb;
      });

      this.setState({ inboxes }, InboxActions.ADD_INBOXES);
    });
  }

  getInboxes(action: any) {
    return this.stateChanged
      .pipe(
        map((state) => {
          if (!state) {
            return;
          }

          return state.inboxes;
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(action);
  }

  unsubscribe() {
    const unsubscribe = {
      op: 'unsubscribe',
      requestId: 2,
    };

    this.socket.emit(unsubscribe);
  }

  subscribe(user: IUser) {
    if (this.isSubscribed) {
      this.unsubscribe();
    }

    const subscription = {
      op: 'subscribe',
      requestId: 2,
      query: {
        className: 'Inbox',
        where: {
          userId: user.objectId,
        },
      },
    };

    this.socket.emit(subscription);
    this.isSubscribed = true;
  }

  getCurrent(action: any) {
    return this.stateChanged
      .pipe(
        map((state) => {
          if (!state?.inboxes) {
            return;
          }

          return state.inboxes.find(
            ({ objectId }) => objectId === state.inboxId,
          );
        }),
        distinctUntilChanged((a, b) => a === b),
      )
      .subscribe(action);
  }

  setCurrent(id: string | null) {
    if (!id) {
      return;
    }

    this.setState({ inboxId: id }, InboxActions.SET_CURRENT_INBOX);
  }

  async getAll(user: IUser) {
    const query = `where={"userId": "${user.objectId}"}&include=sender`;

    await this.http
      .get<{ results: IInbox[] }>(`classes/Inbox?${query}`)
      .pipe(
        map(({ results }) => results),
        tap((res) => {
          this.setState({ inboxes: res }, InboxActions.ADD_INBOXES);
        }),
      )
      .toPromise();
  }

  async createInbox(user: IUser, sender: IUser) {
    const hash = v4();
    const userInboxData: IInbox = {
      userId: user.objectId,
      senderId: sender.objectId,
      sender: {
        __type: 'Pointer',
        className: '_User',
        objectId: sender.objectId,
      },
      lastMessage: '',
      inboxHash: hash,
      deleted: false,
    };
    const senderInboxData: IInbox = {
      userId: sender.objectId,
      senderId: user.objectId,
      sender: {
        __type: 'Pointer',
        className: '_User',
        objectId: user.objectId,
      },
      lastMessage: '',
      inboxHash: hash,
      deleted: false,
    };
    const userInbox = new Inbox(userInboxData);
    const senderInbox = new Inbox(senderInboxData);
    const query = `where={"senderId":"${sender.objectId}", "userId": "${user.objectId}"}`;
    const { results } = await this.http
      .get<{ results: IInbox[] }>(`classes/Inbox?${query}`)
      .toPromise();

    if (results.length > 0) {
      this.router.navigate(['chatlist', results[0].objectId]);

      return;
    }

    const [_, data] = await Promise.all([
      this.http.post('classes/Inbox', senderInbox).toPromise(),
      this.http.post<IInbox>('classes/Inbox', userInbox).toPromise(),
    ]);

    this.router.navigate(['chatlist', data.objectId]);
  }
}
