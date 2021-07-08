import { Injectable } from '@angular/core';
import { ObservableStore } from '@codewithdan/observable-store';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ContactActins, StateStore } from '../models/store.model';
import { IUser } from '../models/user.model';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ContactService extends ObservableStore<StateStore> {
  constructor(private http: HttpService) {
    super({});
  }

  getContacts(action: any) {
    return this.stateChanged
      .pipe(
        map((state) => {
          if (!state) {
            return;
          }

          return state.contacts;
        }),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      )
      .subscribe(action);
  }

  async fetchAll(user: IUser) {
    await this.http
      .get<{ results: IUser[] }>('users')
      .pipe(
        map(({ results }) =>
          results
            .filter((result) => result.objectId !== user.objectId)
            .sort((a, b) => {
              const aFirstName = a.firstName.toLowerCase();
              const bFirstName = b.firstName.toLowerCase();

              if (aFirstName > bFirstName) {
                return 1;
              }

              if (aFirstName < bFirstName) {
                return -1;
              }

              return 0;
            }),
        ),
        tap((users) => {
          this.setState({ contacts: users }, ContactActins.SET_ALL_CONTACT);
        }),
      )
      .toPromise();
  }
}
