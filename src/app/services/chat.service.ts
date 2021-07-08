import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Chat, IChat } from '../models/chat.model';
import { IInbox } from '../models/inbox.model';
import { MessageActions, StateStore } from '../models/store.model';
import { IUser } from '../models/user.model';
import { IMessages } from '../shared/interfaces';
import { HttpService } from './http.service';
import { SocketIoService } from './socket-io.service';

@Injectable({ providedIn: 'root' })
export class ChatService extends ObservableStore<StateStore> {
  messages = new BehaviorSubject<IChat[] | null>(null);
  fetchedMessages: IChat[] = [];
  inboxes: IInbox[] = [];
  isSubscribed = false;

  constructor(private http: HttpService, private socket: SocketIoService) {
    super({});

    this.socket.on('Chat', (data: any) => {
      const state = this.getState();

      if (!data || !state) {
        return;
      }

      const messages = state.messages;

      messages.push(data.object);
      this.setState({ messages }, MessageActions.SET_ONE_MESSAGE);
    });
  }

  unsubscribe() {
    const unsubscribe = {
      op: 'unsubscribe',
      requestId: 1,
    };

    this.socket.emit(unsubscribe);
  }

  subscribe(inbox: IInbox) {
    if (this.isSubscribed) {
      this.unsubscribe();
    }

    const subscription = {
      op: 'subscribe',
      requestId: 1,
      query: {
        className: 'Chat',
        where: {
          inboxHash: inbox?.inboxHash,
        },
      },
    };

    this.socket.emit(subscription);
    this.isSubscribed = true;
  }

  getMessages(action: any) {
    return this.stateChanged
      .pipe(
        map((state) => {
          if (!state) {
            return;
          }

          return state.messages.reduce((groups: IMessages, item: any) => {
            let date = item.createdAt;

            date = formatDate(date, 'dd/MM/yyyy', 'en');

            if (!groups[date]) {
              groups[date] = [];
            }

            groups[date].push(item);

            return groups;
          }, {});
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(action);
  }

  async fetchAll(inbox: IInbox) {
    const query = `where={"inboxHash": "${inbox.inboxHash}"}`;

    await this.http
      .get<{ results: IChat[] }>(`classes/Chat?${query}`)
      .pipe(
        map((res) => res.results),
        tap((messages) => {
          this.messages.next(messages);
          this.fetchedMessages = messages;
          this.setState({ messages }, MessageActions.SET_ALL_MESSAGE);
        }),
      )
      .toPromise();
  }

  async sendMessage(message: string, inbox: IInbox, user: IUser) {
    const pushData = {
      userId: inbox.senderId,
      userName: `${user.firstName} ${user.lastName}`,
      message,
    };
    const chatData: IChat = {
      senderId: inbox.userId,
      receiverId: inbox.senderId,
      message,
      inboxHash: inbox.inboxHash,
    };
    const chat = new Chat(chatData);

    await this.http
      .post('functions/sendMessage', { inbox, chat, pushData })
      .toPromise();
  }
}
