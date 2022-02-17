import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { BookingService } from '../services/booking.service';
import { Router } from '@angular/router';
import { EventsComponent } from '../../events/events.component';

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

  constructor(private bookingService: BookingService, private router: Router) {
    this.calendarOptions.events = this.bookingService.getEvents();
  }

  ngOnInit(): void {}

  navigateToEvents() {
    this.router.navigateByUrl('/events');
  }

  navigateToAdmin() {
    this.router.navigateByUrl('/admin');
  }
}
