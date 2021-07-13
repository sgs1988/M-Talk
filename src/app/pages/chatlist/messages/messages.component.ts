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
  contactIdDetails: any = {};
  enableMemberList: boolean = false;
  groupMessages: any = [];
  userId: any = 2;

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
      let getContactDetails: any = sessionStorage.getItem("contactDetails");
      this.contactIdDetails = JSON.parse(getContactDetails).find((obj: any) => obj.objectId == paramId);
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


    this.groupMessages = [{
      objectId: '1',
      senderId: '1',
      senderName: 'Albert Son',
      message: 'Hellow',
      groupMessage: true
    },
    {
      objectId: '2',
      senderId: '2',
      senderName: 'Abois Abois',
      receiverId: '2',
      message: 'Hi',
      groupMessage: true
    },
    {
      objectId: '3',
      senderId: '1',
      senderName: 'Albert Son',
      receiverId: '2',
      message: 'How are you. What are you doing now.',
      groupMessage: true
    }];

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

  opemMemberList() {
    this.enableMemberList = true;
  }

  closeMemberList() {
    this.enableMemberList = false;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
