import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from './../booking/services/event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  allEvents: any;
  myEvents: any;
  userId: any;
  constructor(
    private eventService: EventService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.userId = JSON.parse(this.cookieService.get('user')).userId;
    console.log(this.userId);
  }

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {
    this.eventService.getEvents().subscribe(
      (data: any) => {
        console.log(data.data);
        this.allEvents = data.data;
        this.myEvents = this.allEvents.filter(
          (event: any) => event.userId == this.userId
        );
        console.log(this.myEvents);
      },
      (err) => {
        console.log('Error in getting events', err);
      }
    );
  }

  deleteEvent(event: any) {
    this.eventService.deleteEvent(event.eventId).subscribe(
      (data: any) => {
        console.log('Event deleted', data);
        this.getMyEvents();
      },
      (err) => {
        console.log('Error is deleting Event', err);
      }
    );
  }

  editEvent(event: any) {
    this.router.navigate(['/eventEdit'], { state: { eventData: event } });
  }
}
