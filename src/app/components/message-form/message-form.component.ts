import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-message-form',
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.scss'],
})
export class MessageFormComponent {
  @Output() send = new EventEmitter<string>();
  message = '';

  constructor() {}

  sendMessage() {
    if (!this.message) {
      return;
    }

    this.send.emit(this.message);
    this.message = '';
  }
}
