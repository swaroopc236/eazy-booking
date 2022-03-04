import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import {
  CalendarOptions,
  Calendar,
  SlotLabelMountArg,
  SlotLaneMountArg,
  ViewMountArg,
  FullCalendarComponent,
} from '@fullcalendar/angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsComponent } from '../../events/events.component';
import { RoomService } from '../../room/services/room.service';
import { EventService } from '../services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { URLSearchParams } from 'url';
// import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';

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
    // console.log(selectInfo.startStr, selectInfo.endStr);
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
    // selectInfo.jsEvent.target.style.backgroundColor = 'green';
    // selectInfo.jsEvent.target.style.color = 'red';
    // console.log(selectInfo.jsEvent.target.style.backgroundColor);
  };

  eventSelect = (eventInfo: any) => {
    console.log(eventInfo.event.title);
  };

  dateSelect = (dateInfo: any) => {
    this.currentSelectedDate = dateInfo.startStr.split('T')[0];
    this.urlParams.set('selectedDate', this.currentSelectedDate);
    let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + this.urlParams.toString();
    window.history.replaceState({path: newurl}, '', newurl);
    // console.log(this.currentSelectedDate);
  };

  canSelect() {
    return true;
  }

  viewManipulation(view: ViewMountArg) {
    // this.currentView = view;
    // console.log("view mani");
  }

  cellManipulation(cell: SlotLaneMountArg) {
    // console.log(cell.view);
    const currentDateTime = Date.now() - 900000;
    const todayDateTime = new Date(new Date().toDateString()).getTime();
    const slotDateTime = cell.time!.milliseconds;

    // console.log("cell mani");

    if (currentDateTime > todayDateTime + slotDateTime) {
      cell.el.style.backgroundColor = 'darkgrey';
    }
    // console.log(new Date(new Date().toDateString()).getTime());
    // console.log(cell.time?.milliseconds);
  }

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
    selectable: this.canSelect(),
    selectConstraint: {
      start: Date.now() - 900000,
    },
    selectOverlap: false,
    select: this.timeSelect,
    eventClick: this.eventSelect,
    datesSet: this.dateSelect,
    // slotLaneDidMount: this.cellManipulation,
    // viewDidMount: this.viewManipulation,
  };

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events$: Observable<any>;
  rooms$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private roomService: RoomService,
    private eventService: EventService,
    private cookieService: CookieService,
    // private spinnerService: NgxSpinnerService,
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
      console.log(this.events);
      console.log('Selected room', this.selectedRoomId);
      this.roomEvents = this.events.filter(
        (event: any) => event.roomId == this.selectedRoomId
      );
      console.log(this.roomEvents);
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
    // console.log(this.roomEventsDetail);
    this.calendarOptions.events = this.roomEventsDetail;
    // this.calendarApi.render();
  }

  ngOnInit(): void {

    // this.spinnerService.show();
    this.roomService.getRooms().subscribe(
      (data: any) => {
        // console.log(data.data);
        this.rooms = data.data;
        this.selectedRoomId =
          this.route.snapshot.queryParams['selectedRoomId'] ||
          this.rooms[0].roomId;

        this.urlParams.set('selectedRoomId', this.selectedRoomId);

        this.currentSelectedDate =
          this.route.snapshot.queryParams['selectedDate'] ||
          this.currentSelectedDate;

        this.calendarApi.gotoDate(this.currentSelectedDate);

        // this.eventService.socket.on('LATEST_EVENTS', (data: any) => {
        //   // console.log(data);
        //   this.events = data.data;
        //   // console.log(this.events);
        //   this.roomEvents = this.events.filter(
        //     (event: any) => event.roomId === this.selectedRoomId
        //   );
        //   // console.log(this.roomEvents);
        //   this.getEventDetailsFromEvent();
        // })

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
        // this.spinnerService.hide();
      },
      (err) => {
        console.log('Error in getting rooms', err);
        // this.spinnerService.hide();
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
    this.router.navigateByUrl('/myEvents', { state: { selectedRoomId: this.selectedRoomId}});
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
