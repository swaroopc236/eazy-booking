import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { Observable } from 'rxjs';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      start: 'title',
      center: 'today prev,next',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridDay',
  };

  // events$: Observable<any[]>;

  constructor(private bookingService: BookingService) {
    this.calendarOptions.events = this.bookingService.getEvents();
    // this.events$ = this.bookingService.getAllEvents();
    // this.printEvents();
  }

  ngOnInit(): void {}

  // printEvents() {
  //   this.events$.subscribe((data) => {
  //     console.log(data);
  //   });
  // }
}
