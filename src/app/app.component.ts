import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { IUser } from './models/user.model';
import { AuthService } from './services/auth.service';
import { NewsLetterService } from './services/news-letter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showToast = true;
  private user: IUser = {} as IUser;

  constructor(
    private auth: AuthService,
    private update: SwUpdate,
    private news: NewsLetterService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.auth.checkLogin();
    this.updateClient();

    this.auth.user.subscribe((user) => {
      if (!user) {
        return;
      }

      this.user = user;

      this.auth.checkPin(user);
    });

    window.addEventListener('load', () => {
      navigator.onLine
        ? this.news.online(this.user, true)
        : this.news.online(this.user, false);

      window.addEventListener('online', () => {
        this.news.online(this.user, true);
      });

      window.addEventListener('offline', () => {
        this.news.online(this.user, false);
      });
    });

    this.router.navigate(['chatlist']);
  }

  updateClient() {
    if (!this.update.isEnabled) {
      return;
    }

    this.update.available.subscribe(() => {
      if (confirm('update available please update the app.')) {
        this.update.activateUpdate().then(() => location.reload());
      }
    });
  }
}
