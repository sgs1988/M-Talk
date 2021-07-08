import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { AUTH_TOKEN } from '../shared/const';
import { ISession, IUser, User } from '../models/user.model';
import { HttpService } from './http.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ObservableStore } from '@codewithdan/observable-store';
import { StateStore, UserActions } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends ObservableStore<StateStore> {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpService, private router: Router) {
    super({});
  }

  getUser(action: any) {
    return this.stateChanged
      .pipe(
        map((state) => {
          if (!state?.user) {
            return;
          }

          return state.user;
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(action);
  }

  checkLogin(): void {
    const token = localStorage.getItem(AUTH_TOKEN);

    if (!token) {
      this.user.next({} as User);
      this.setState({ user: {} as IUser }, UserActions.REMOVE_USER);

      return;
    }

    this.http.get<ISession>(`sessions/me`).subscribe((session) => {
      this.http
        .get<IUser>(`users/${session.user.objectId}`)
        .subscribe((user) => {
          this.createUser({ ...user, session });
        });
    });
  }

  checkPin(user: IUser) {
    let hidden = false;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden' && user.pin) {
        hidden = true;
      } else {
        if (hidden) {
          this.loopCheck(user);
          hidden = false;
        }
      }
    });
  }

  loopCheck(user: IUser) {
    let pin = prompt('Enter your pin');

    if (pin === user.pin) {
      return;
    }

    alert('Mismatched pin!');
    this.loopCheck(user);
  }

  login(data: IUser): Observable<IUser> {
    return this.http.get<IUser>('login', data).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }),
      tap((res) => {
        this.createUser(res);
      }),
    );
  }

  signUp(data: IUser): void {
    this.http.post<IUser>('users', data).subscribe((res) => {
      this.createUser({ ...res, ...data });
      this.router.navigate(['/']);
    });
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN);

    this.http.post('logout').subscribe();
    this.user.next({} as User);
    this.setState({ user: {} as IUser }, UserActions.REMOVE_USER);
    this.router.navigate(['/login']);
  }

  createUser(data: IUser): void {
    localStorage.setItem(AUTH_TOKEN, data.sessionToken);

    this.http.get<ISession>('sessions/me').subscribe((session) => {
      const userData = { ...data, session };

      this.user.next(new User(userData));
      this.setState({ user: new User(userData) }, UserActions.ADD_USER);
    });
  }

  async setPin(pin: string, backupPin: string, user: IUser) {
    const data = {
      pin,
      backupPin,
    };

    await this.http.put(`users/${user.objectId}`, data).toPromise();
  }

  async changeName(firstName: string, lastName: string, user: IUser) {
    try {
      await this.http
        .put(`users/${user.objectId}`, {
          firstName,
          lastName,
        })
        .toPromise();
      this.setState({ user: new User({ ...user, firstName, lastName }) });
    } catch (error) {}
  }
}
