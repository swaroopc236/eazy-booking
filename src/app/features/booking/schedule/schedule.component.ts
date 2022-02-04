import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
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

  constructor(private bookingService: BookingService) {
    this.calendarOptions.events = this.bookingService.getEvents();
  }

  ngOnInit(): void {}
}
