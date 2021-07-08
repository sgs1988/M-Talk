import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
})
export class RegisterComponent implements OnInit {
  showPassword = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user.subscribe((user) => {
      if (!user) {
        return;
      }

      if (user.isLoggedIn) {
        this.router.navigate(['/']);
      }
    });
  }

  onSubmit(form: any): void {
    this.auth.signUp(form.value);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
