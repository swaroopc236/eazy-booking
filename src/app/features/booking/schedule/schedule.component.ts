import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomService } from '../../room/services/room.service';
import { EventService } from '../services/event.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit, AfterViewInit {
  selectedRoomId: any;
  rooms: any;
  events: any;
  roomEvents: any;
  roomEventsDetail: any = [];

  calendarApi: any;
  currentSelectedDate: any;
  currentSelectedTime = {
    startTime: '',
    endTime: '',
  };
  currentView: any = undefined;

  isUserLoggedIn: boolean;
  isAdmin: boolean;

  urlParams = new URLSearchParams(window.location.search);

  timeSelect = (selectInfo: any) => {
    const startDate = selectInfo.startStr.substring(8, 10);
    const endDate = selectInfo.endStr.substring(8, 10);
    if (startDate !== endDate) {
      this.calendarApi.unselect();
      return;
    }
    this.currentSelectedDate = selectInfo.startStr.substring(0, 10);
    console.log('successful selection');
    this.currentSelectedTime.startTime = selectInfo.startStr
      .split('T')[1]
      .substring(0, 5);
    this.currentSelectedTime.endTime = selectInfo.endStr
      .split('T')[1]
      .substring(0, 5);
    this.navigateToEvents();
  };

  eventSelect = (eventInfo: any) => {
    console.log(eventInfo.event.title);
  };

  dateSelect = (dateInfo: any) => {
    this.currentSelectedDate = dateInfo.startStr.split('T')[0];
    this.urlParams.set('selectedDate', this.currentSelectedDate);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + this.urlParams.toString();
    window.history.replaceState({path: newurl}, '', newurl);
  };

  calendarOptions: CalendarOptions = {
    allDaySlot: false,
    slotDuration: '00:15:00',
    scrollTime: new Date().toTimeString().substring(0, 8),
    nowIndicator: true,
    dayMaxEvents: true,
    headerToolbar: {
      start: 'title',
      center: 'today prev,next',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridDay',
    selectable: true,
    selectConstraint: {
      start: Date.now() - 900000,
    },
    selectOverlap: false,
    select: this.timeSelect,
    eventClick: this.eventSelect,
    datesSet: this.dateSelect,
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events$: Observable<any>;
  rooms$: Observable<any>;

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private eventService: EventService,
    private cookieService: CookieService,
    private loader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.isUserLoggedIn = this.authService.isAuthenticated();
    this.isAdmin = this.authService.isAdmin();

    this.events$ = this.eventService.onLatestEvents();
    this.printEvents();

    this.rooms$ = this.eventService.onLatestRooms();
    this.printRooms();
  }

  printRooms() {
    this.rooms$.subscribe((data) => {
      this.rooms = data.data;
    })
  }


  printEvents() {
    this.events$.subscribe((data) => {
      this.events = data.data;
      this.roomEvents = this.events.filter(
        (event: any) => event.roomId == this.selectedRoomId
      );
      this.getEventDetailsFromEvent();
    });
  }

  getEventDetailsFromEvent() {
    this.roomEventsDetail = [];
    this.roomEvents.filter((e: any) => {
      if (e.eventDetails) {
        this.roomEventsDetail.push(e.eventDetails);
      }
    });
    this.calendarOptions.events = this.roomEventsDetail;
  }

  ngOnInit(): void {
    this.loader.start();
    this.roomService.getRooms().subscribe(
      (data: any) => {
        this.rooms = data.data;
        this.selectedRoomId =
          this.route.snapshot.queryParams['selectedRoomId'] ||
          this.rooms[0].roomId;

        this.urlParams.set('selectedRoomId', this.selectedRoomId);

        this.currentSelectedDate =
          this.route.snapshot.queryParams['selectedDate'] ||
          this.currentSelectedDate;

        this.calendarApi.gotoDate(this.currentSelectedDate);

        this.eventService.getEvents().subscribe(
          (data: any) => {
            // console.log(data.data);
            this.events = data.data;
            this.roomEvents = this.events.filter(
              (event: any) => event.roomId == this.selectedRoomId
            );
            this.getEventDetailsFromEvent();
          },
          (err) => {
            console.log('Error in getting events', err);
          }
        );
        this.loader.stop()
      },
      (err) => {
        console.log('Error in getting rooms', err);
        this.loader.stop()
      }
    );
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.calendarComponent.getApi();

    let date = new Date();
    let currentTime = '0' + Math.abs(date.getHours() - 2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + '00';
    this.calendarApi.scrollToTime(currentTime);
  }

  onChange($event: any) {
    this.selectedRoomId = $event.target.value;
    this.urlParams.set('selectedRoomId', this.selectedRoomId);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + this.urlParams.toString();
    window.history.replaceState({path: newurl}, '', newurl);
  
    this.roomEvents = this.events.filter(
      (event: any) => event.roomId == this.selectedRoomId
    );
    this.getEventDetailsFromEvent();
  }

  logoutUser() {
    this.authService.logoutUser().subscribe(
      (data) => {
        console.log(data);
        this.cookieService.delete('user');
        this.isUserLoggedIn = false;
        this.isAdmin = false;
      },
      (err) => {
        console.log('Error while logging out', err);
      }
    );
  }

  navigateToEvents() {
    this.router.navigate(['/events'], {
      queryParams: {
        roomId: this.selectedRoomId,
        selectedDate: this.currentSelectedDate,
        startTime: this.currentSelectedTime.startTime,
        endTime: this.currentSelectedTime.endTime,
      },
    });
  }

  navigateToHelpRoomEvents() {
    this.router.navigateByUrl('/helproom');
  }

  navigateToMyEvents() {
    this.router.navigateByUrl('/myEvents');
  }

  navigateToHelpPage() {
    this.router.navigateByUrl('/help');
  }

  navigateToAdmin() {
    this.router.navigateByUrl('/admin');
  }

  navigateToLogin() {
    this.router.navigateByUrl('/login');
  }

  navigateToUserEdit() {
    const user = JSON.parse(this.cookieService.get('user'));
    console.log(user);
    this.router.navigateByUrl('/userEdit', {
      state: { userData: user },
    });
  }
}
