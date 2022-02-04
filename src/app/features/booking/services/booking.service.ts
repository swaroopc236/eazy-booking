import { Injectable } from '@angular/core';
import { EventSourceInput } from '@fullcalendar/angular';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  events: EventSourceInput = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // today's date

  constructor() {
    // mock events
    this.events = [
      {
        title: 'Event 1',
        start: this.TODAY_STR + 'T14:00:00',
        end: this.TODAY_STR + 'T15:00:00',
      },
      {
        title: 'Event 2',
        start: this.TODAY_STR + 'T09:30:00',
        end: this.TODAY_STR + 'T10:00:00',
      },
      {
        title: 'Event 3',
        start: this.TODAY_STR,
        allDay: true,
      },
      {
        title: 'Event 4',
        start: this.TODAY_STR + 'T18:45:00',
        end: this.TODAY_STR + 'T19:37:00',
      },
    ];
  }

  getEvents() {
    return this.events;
  }
}
