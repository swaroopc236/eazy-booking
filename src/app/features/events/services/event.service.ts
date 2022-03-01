import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private EVENTS_URL = 'https://eazy-booking-staging.herokuapp.com/events';
  // private ROOMS_URL = 'http://localhost:5000/rooms';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  
  getEvents() {
    return this.http.get(`${this.EVENTS_URL}`);
  }

  addEvent(eventDetails: any) {
    return this.http.post(`${this.EVENTS_URL}`, eventDetails, {
      withCredentials: true,
    });
  }

  editEvent(eventDetails: any) {
    return this.http.put(
      `${this.EVENTS_URL}/${eventDetails.eventTitle}`,
      eventDetails,
      {
        withCredentials: true,
      }
    );
  }

  deleteEvent(eventTitle: string) {
    return this.http.delete(`${this.EVENTS_URL}/${eventTitle}`, {
      withCredentials: true,
    });
  }
}
