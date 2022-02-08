import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  WS_ENDPOINT = 'ws://localhost:5050';
  private socket$: WebSocketSubject<any>;
  private messagesSubject$ = new Subject<any>();
  public messages$: Observable<any> = this.messagesSubject$.pipe(
    catchError((e) => {
      throw e;
    })
  );
  ws: any;
  constructor() {
    // this.socket$ = this.getNewWebSocket();
    this.socket$ = webSocket('ws://localhost:5050');
    console.log(this.socket$);

    this.ws = new WebSocket(this.WS_ENDPOINT);
    this.ws.onmessage = (data: any) => {
      console.log(data.data);
    };
    this.ws.onclose = (data: any) => {
      console.log('Disconnected');
    };
  }

  public connect(): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket();
      console.log(this.socket$);
      // const messages: any = this.socket$.pipe(
      //   tap({
      //     error: (error) => console.log(error),
      //   }),
      //   catchError((_) => EMPTY)
      // );
      // this.messagesSubject$.next(messages);
    }
    const messages: any = this.socket$.pipe(
      tap({
        error: (error) => console.log(error),
      }),
      catchError((_) => EMPTY)
    );
    this.messagesSubject$.next(messages);
  }

  private getNewWebSocket() {
    return webSocket(this.WS_ENDPOINT);
  }

  close() {
    this.socket$.complete();
  }
}
