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
  // users$: Observable<any[]>;
  wsData: any = null;
  events: any = null;

  eventsData$: Observable<any[]>;

  constructor(
    private bookingService: BookingService,
    private eventService: EventService
  ) {
    this.eventService.connect();
    // this.eventsData$ = this.eventService.messages$;
    this.eventsData$ = fromEvent(this.eventService.ws, 'message');
    this.printEvents();
    // this.eventsData$ = this.eventService.messages$.pipe(
    // map(rows => rows.data),
    // catchError(error => { throw error }),
    // tap({
    //   error: error => console.log('[Live component] Error:', error),
    //   complete: () => console.log('[Live component] Connection Closed')
    // }
    // )
    // );
    // this.users$ = this.bookingService.getAllEvents();
    // this.printUsers();
  }

  ngOnInit(): void {}

  printEvents() {
    this.eventsData$.subscribe((data: any) => {
      // console.log(data.data);
      this.wsData = JSON.parse(data.data);
      if (this.wsData.msgType == 'ALL_EVENTS') {
        this.events = this.wsData.data;
        console.log(this.events);
      }
    });
  }

  // printUsers() {
  //   this.users$.subscribe((data: any) => {
  //     console.log(data);
  //     this.users = data.data;
  //   });
  // }
}
