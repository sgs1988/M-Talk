import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  error = '';
  showPassword = false;
  private userSubs = new Subscription();
  private loginSubs = new Subscription();

  constructor(private auth: AuthService, private router: Router) {}

  onFormSubmit(form: any): void {
    const { value } = form;

    this.loginSubs = this.auth.login(value).subscribe(
      () => {
        this.router.navigate(['/chatlist']);
      },
      ({ error }) => {
        this.error = error;
      },
    );
  }

  ngOnInit(): void {
    this.userSubs = this.auth.user.subscribe((user) => {
      if (!user) {
        return;
      }

      if (user.isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
    this.loginSubs.unsubscribe();
  }

  warningClosed(): void {
    this.error = '';
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
