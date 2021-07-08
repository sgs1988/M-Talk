import { Component, Input } from '@angular/core';
import { IInbox } from 'src/app/models/inbox.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent {
  @Input() inbox: IInbox = {} as IInbox;

  constructor() {}
}
