import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SocketIoService {
  private message = new Subject<any>();
  private socket = new WebSocket(environment.liveQueryUrl);
  private isConnected = new BehaviorSubject<boolean>(false);

  constructor() {
    this.socket.addEventListener('open', () => {
      this.socket.send(
        JSON.stringify({ op: 'connect', applicationId: environment.appId }),
      );

      this.isConnected.next(true);
    });

    this.socket.addEventListener('message', (message) => {
      this.message.next(message.data);
    });
  }

  emit(data: any) {
    const dataStringify = JSON.stringify(data);

    return this.isConnected.subscribe((connected) => {
      if (!connected) {
        return;
      }

      this.socket.send(dataStringify);
    });
  }

  on(type: string, action: any) {
    this.message
      .pipe(
        map((data) => {
          const parseData = JSON.parse(data);

          if (parseData?.object?.className !== type) {
            return null;
          }

          return parseData;
        }),
      )
      .subscribe(action);
  }
}
