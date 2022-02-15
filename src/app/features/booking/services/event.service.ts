import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  WS_ENDPOINT_REMOTE = 'https://eazy-booking-staging.herokuapp.com';

  WS_ENDPOINT_LOCAL = 'http://localhost:5000';

  ws: any;
  socket: any;
  constructor() {
    // this.ws = new WebSocket(this.WS_ENDPOINT_LOCAL);
    // this.ws = new WebSocket(this.WS_ENDPOINT_REMOTE);
    // console.log(this.ws);

    // this.ws.onopen = () => {
    //   console.log('Open');
    // };
    // this.ws.onmessage = (data: any) => {
    //   console.log(JSON.parse(data.data).data);
    // };
    // this.ws.onerror = (err: any) => {
    //   console.log('Something went wrong - ', err);
    // };
    // this.ws.onclose = (data: any) => {
    //   console.log('Disconnected');
    // };

    this.socket = io(this.WS_ENDPOINT_REMOTE);

    this.socket.on('NEW_CONNECTION', (data: any) => {
      console.log(data);
    });

    this.socket.on('BROADCAST', (data: any) => {
      console.log(data);
    });
  }

  onLatestEvents() {
    return new Observable((observer) => {
      this.socket.on('LATEST_EVENTS', (data: any) => {
        console.log(data);
        observer.next(data);
      });
    });
  }

  onLatestRooms() {
    return new Observable((observer) => {
      this.socket.on('LATEST_ROOMS', (data: any) => {
        console.log(data);
        observer.next(data);
      });
    });
  }
}
