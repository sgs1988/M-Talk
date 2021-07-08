import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { environment } from 'src/environments/environment';
import { INewsLetter } from '../models/news-letter.model';
import { IUser } from '../models/user.model';
import { HttpService } from './http.service';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class NewsLetterService {
  readonly vapid =
    'BD1_UC6deVVg4rn7jvj6NeJOrYIf9UkL1RCngay3Oixv1ZOYa4N1F0-L9zI3CbjY3OzapnZswCuKQA6lyTAZP5U';

  constructor(
    private http: HttpService,
    private swPush: SwPush,
    private toast: ToastService,
  ) {}

  async create(user: IUser) {
    if (!environment.production) {
      return;
    }

    try {
      const subs = await this.swPush.requestSubscription({
        serverPublicKey: this.vapid,
      });
      const newsData: INewsLetter = {
        subs,
        userId: user.objectId,
        user: {
          __type: 'Pointer',
          className: '_User',
          objectId: user.objectId,
        },
      };

      await this.http.post('classes/NewsLetter', newsData).toPromise();
      this.toast.show('Notification successfully enabled');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('denied the notification', error);
    }
  }

  online(user: IUser, event: any) {}
}
