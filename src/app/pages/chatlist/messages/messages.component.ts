import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IInbox, Inbox } from 'src/app/models/inbox.model';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { InboxService } from 'src/app/services/inbox.service';
import { IMessages } from 'src/app/shared/interfaces';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
})
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('view', { static: true }) private view: any;

  user: IUser = {} as IUser;
  currentInbox: Inbox = {} as IInbox;
  sender: IUser = {} as IUser;
  messages: IMessages = {};

  private subs = new SubSink();

  constructor(
    private chat: ChatService,
    private inbox: InboxService,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');

      this.inbox.setCurrent(paramId);
    });

    this.subs.sink = this.auth.getUser((user: IUser) => {
      if (!user) {
        return;
      }

      this.user = user;
    });

    this.subs.sink = this.inbox.getCurrent((inbox: IInbox) => {
      if (!inbox) {
        return;
      }

      this.chat.fetchAll(inbox);
      this.chat.subscribe(inbox);
      this.currentInbox = inbox;
      this.sender = inbox.sender as IUser;
    });

    this.subs.sink = this.chat.getMessages((messages: IMessages) => {
      if (!messages) {
        return;
      }

      this.messages = messages;
    });

    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    try {
      this.view.nativeElement.scrollTop = this.view.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(message: string) {
    this.chat.sendMessage(message, this.currentInbox, this.user);
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
