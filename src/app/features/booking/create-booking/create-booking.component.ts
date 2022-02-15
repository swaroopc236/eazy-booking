import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { BookingService } from '../services/booking.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.css'],
})
export class CreateBookingComponent implements OnInit {
  wsData: any = null;
  events: any = null;

  eventsData$: Observable<any>;

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {
    // this.eventsData$ = fromEvent(this.eventService.ws, 'message');
    this.eventsData$ = this.eventService.onLatestEvents();
    this.printEvents();
  }

  ngOnInit(): void {}

  printEvents() {
    this.eventsData$.subscribe((data: any) => {
      // console.log(data.data);
      this.wsData = data;
      if (this.wsData.msgType == 'ALL_EVENTS') {
        this.events = this.wsData.data;
        // console.log(this.events);
      }
    });
  }
}
