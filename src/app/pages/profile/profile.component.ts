import { Component, OnDestroy, OnInit } from '@angular/core';
import { IUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { NewsLetterService } from 'src/app/services/news-letter.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  pin: string = '';
  backupPin: string = '';
  user: IUser = {} as IUser;
  firstName = '';
  lastName = '';
  dateOfBirth: Date | null = null;
  private subs = new SubSink();
  public isCollapsed = false;

  constructor(private auth: AuthService, private news: NewsLetterService) {}

  ngOnInit() {
    this.subs.sink = this.auth.getUser((user: IUser) => {
      if (!user) {
        return;
      }

      this.user = user;
      this.firstName = this.user.firstName;
      this.lastName = this.user.lastName;
    });
  }

  onSave() {
    if (!this.pin || !this.backupPin) {
      return;
    }

    this.auth.setPin(this.pin, this.backupPin, this.user);
  }

  onUserSave() {
    this.auth.changeName(this.firstName, this.lastName, this.user);
  }

  onLogout() {
    this.auth.logout();
  }

  onFirstName({ target }: any) {
    this.firstName = target.value;
  }

  onLastName({ target }: any) {
    this.lastName = target.value;
  }

  enableNotification() {
    this.news.create(this.user);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
