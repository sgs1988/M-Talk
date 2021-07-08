import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { ContactService } from 'src/app/services/contact.service';
import { InboxService } from 'src/app/services/inbox.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit, OnDestroy {
  user = {} as IUser;
  users: IUser[] = [];
  searchText = '';
  currentChar = '';
  private subs = new SubSink();

  constructor(
    private contact: ContactService,
    private inbox: InboxService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.auth.getUser((user: IUser) => {
      if (!user) {
        return;
      }

      this.contact.fetchAll(user);
      this.user = user;
    });

    this.subs.sink = this.contact.getContacts((contacts: IUser[]) => {
      if (!contacts) {
        return;
      }

      this.users = contacts;
    });
  }

  checkChar(firstName: string): boolean {
    if (this.currentChar === firstName.charAt(0).toLowerCase()) {
      return false;
    } else {
      this.currentChar = firstName.charAt(0).toLowerCase();

      return true;
    }
  }

  async onStartChat(selectedUser: IUser) {
    this.inbox.createInbox(this.user, selectedUser);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
