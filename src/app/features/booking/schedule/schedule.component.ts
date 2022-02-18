import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
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

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.calendarOptions.events = this.bookingService.getEvents();
    // this.events$ = this.bookingService.getAllEvents();
    // this.printEvents();
  }

  ngOnInit(): void {}

  logoutUser() {
    this.authService.logoutUser().subscribe(
      (data) => {
        console.log(data);
        this.cookieService.delete('user');
      },
      (err) => {
        console.log('Error while logging out', err);
      }
    );
  }

  // printEvents() {
  //   this.events$.subscribe((data) => {
  //     console.log(data);
  //   });
  // }
}
