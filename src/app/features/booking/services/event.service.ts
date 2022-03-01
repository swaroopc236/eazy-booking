import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  currentRoom: any;
  WS_ENDPOINT_REMOTE = 'https://eazy-booking-staging.herokuapp.com';

  WS_ENDPOINT_LOCAL = 'http://localhost:5000';
  EVENTS_URL: string = 'https://eazy-booking-staging.herokuapp.com/events';
  TODAY_STR = new Date().toISOString();

  socket: any;
  constructor(private http: HttpClient) {
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

  getEvents() {
    return this.http.get(`${this.EVENTS_URL}`);
  }

  addEvent(event: any) {
    event.eventDetails.start = this.TODAY_STR.replace(
      /T.*$/,
      `T${event.eventDetails.start}`
    );
    event.eventDetails.end = this.TODAY_STR.replace(
      /T.*$/,
      `T${event.eventDetails.end}`
    );
    return this.http.post(`${this.EVENTS_URL}`, event, {
      withCredentials: true,
    });
    // console.log(event);
  }

  updateEvent(event: any) {
    return this.http.put(`${this.EVENTS_URL}`, event, {
      withCredentials: true,
    });
  }

  deleteEvent() {
    return this.http.delete(`${this.EVENTS_URL}`);
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
