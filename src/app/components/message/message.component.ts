import { Component, Input } from '@angular/core';
import { IChat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent {
  @Input() message: IChat = {} as IChat;

  constructor() {}
}
