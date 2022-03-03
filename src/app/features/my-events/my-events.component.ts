import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from './../booking/services/event.service';
import { Component, OnInit } from '@angular/core';
// import { NgxSpinnerService } from 'ngx-spinner';

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
    // private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.userId = JSON.parse(this.cookieService.get('user')).userId;
  }

  ngOnInit(): void {
    this.getMyEvents();
  }

  getMyEvents() {
    // this.spinnerService.show();
    this.eventService.getEvents().subscribe(
      (data: any) => {
        // console.log(data.data);
        this.allEvents = data.data;
        this.myEvents = this.allEvents.filter(
          (event: any) => event.userId == this.userId
        );
        // console.log(this.myEvents);
        // this.spinnerService.hide();
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

  getReadableDate(date: string) {
    const eventDate = date.split('T')[0];
    let readableDate = new Date(eventDate).toDateString();
    readableDate = readableDate.substring(4, 10) + ', ' + readableDate.substring(11, 15);
    return readableDate;
  }

  getReadableTime(date: string) {
    var timeString = date.split('T')[1];
    var H = +timeString.substring(0, 2);
    var h = H % 12 || 12;
    var ampm = (H < 12 || H === 24) ? "am" : "pm";
    timeString = h + timeString.substring(2, 5) + ' ' + ampm;
    return timeString;
  }
}
