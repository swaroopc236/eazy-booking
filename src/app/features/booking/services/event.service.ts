import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  currentRoom: any;
  WS_ENDPOINT_REMOTE = 'https://eazy-booking-staging.herokuapp.com';

  EVENTS_URL: string = 'https://eazy-booking-staging.herokuapp.com/events';

  public socket: any;
  constructor(private http: HttpClient) {

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

  getEventsInRoom(roomId: string) {
    return this.http.get(`${this.EVENTS_URL}/room/${roomId}`);
  }

  addEvent(event: any, date: string) {
    event.eventDetails.start = `${date}T${event.eventDetails.start}`;
    event.eventDetails.end = `${date}T${event.eventDetails.end}`;
    return this.http.post(`${this.EVENTS_URL}`, event, {
      withCredentials: true,
    });
  }

  editEvent(event: any, date: string) {
    event.eventDetails.start = `${date}T${event.eventDetails.start}`;
    event.eventDetails.end = `${date}T${event.eventDetails.end}`;
    return this.http.put(`${this.EVENTS_URL}/${event.eventId}`, event, {
      withCredentials: true,
    });
  }

  deleteEvent(eventId: string) {
    return this.http.delete(`${this.EVENTS_URL}/${eventId}`, {
      withCredentials: true,
    });
  }

  onLatestEvents() {
    return new Observable((observer) => {
      this.socket.on('LATEST_EVENTS', (data: any) => {
        observer.next(data);
      });
    });
  }

  onLatestRooms() {
    return new Observable((observer) => {
      this.socket.on('LATEST_ROOMS', (data: any) => {
        observer.next(data);
      });
    });
  }

  isOverlapping(event: any, date: string) {
    return new Promise((resolve, reject) => {
      let isOverlap: boolean = false;
      this.getEventsInRoom(event.roomId).subscribe((data: any) => {
        let roomEvents = data.data;
        roomEvents = roomEvents.filter(
          (event: any) => event.eventDetails.start.substring(0, 10) == date
        )
        roomEvents = roomEvents.filter(
          (e: any) => e.eventId !== event.eventId
        )
        console.log(roomEvents);
        const eventStart = event.eventDetails.start;
        const eventEnd = event.eventDetails.end;

        roomEvents.map((re: any) => {
          const roomEventStart = re.eventDetails.start.split('T')[1];
          const roomEventEnd = re.eventDetails.end.split('T')[1];
          if((eventStart >= roomEventStart && eventStart < roomEventEnd) ||
              (eventEnd > roomEventStart && eventEnd <= roomEventEnd) ||
              (eventStart <= roomEventStart && eventEnd >= roomEventEnd)) {
                isOverlap = true;
                return;
          }
        })
        resolve(isOverlap);
      },
      (err) => {
        console.log('Error in getting events', err);
        reject(err);
      });
    });
  }
}
