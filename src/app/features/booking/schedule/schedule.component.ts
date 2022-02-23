import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BookingService } from '../services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsComponent } from '../../events/events.component';
import { RoomService } from '../../room/services/room.service';
import { EventService } from '../services/event.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  selectRoomForm: FormGroup;
  roomEventsDetail: any = [];
  timeSelect = (selectInfo: any) => {
    console.log(selectInfo.startStr);
    console.log(selectInfo.endStr);
  };

  eventSelect = (eventInfo: any) => {
    console.log(eventInfo.event.title);
  };

  calendarOptions: CalendarOptions = {
    slotDuration: '00:15:00',
    nowIndicator: true,
    headerToolbar: {
      start: 'title',
      center: 'today prev,next',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    initialView: 'timeGridDay',
    selectable: true,
    selectOverlap: false,
    select: this.timeSelect,
    eventClick: this.eventSelect,
  };

  // events$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private authService: AuthService,
    private roomService: RoomService,
    private eventService: EventService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.selectRoomForm = this.fb.group({
      roomNames: ['', [Validators.required]],
    });
    // this.events$ = this.bookingService.getAllEvents();
    // this.printEvents();
  }

  get roomNames() {
    return this.selectRoomForm.get('roomNames');
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
    this.roomService.getRooms().subscribe(
      (data: any) => {
        // console.log(data.data);
        this.rooms = data.data;
        this.selectedRoomId =
          this.route.snapshot.queryParams['selectedRoomId'] ||
          this.rooms[0].roomId;
        // this.selectedRoomId =
        //   this.eventService.currentRoom || this.rooms[0].roomId;
        console.log(this.selectedRoomId);

        this.eventService.getEvents().subscribe(
          (data: any) => {
            console.log(data.data);
            this.events = data.data;
            this.roomEvents = this.events.filter(
              (event: any) => event.roomId == this.selectedRoomId
            );
            this.getEventDetailsFromEvent();
            console.log(this.roomEventsDetail);
            // this.calendarOptions.events = this.roomEventsDetail;
            // console.log(this.roomEvents);
          },
          (err) => {
            console.log('Error in getting events', err);
          }
        );
      },
      (err) => {
        console.log('Error in getting rooms', err);
      }
    );
  }

  ngAfterViewInit(): void {
    // console.log(document.getElementById('rooms')!.options);
    let el: HTMLSelectElement = <HTMLSelectElement>(
      document.getElementById('rooms')
    );
    el.options.selectedIndex = 4;
    el.value = this.selectedRoomId;
    console.log(el.options.selectedIndex);
    console.log(el.value);
    try {
      // console.log(el.options[2]);
      for (var i = 0; i < el.options.length; i++) {
        console.log('current id', el.options[i].value);
        if (el.options[i].value === this.selectedRoomId) {
          console.log('matched value');
          el.options[i].selected = true;
          el.selectedIndex = i;
          break;
        }
      }
    } catch (e) {
      console.log('Exception occured', e);
    }

    // console.log(el.options);
  }

  onChange($event: any) {
    this.selectedRoomId = $event.target.value;
    this.eventService.currentRoom = this.selectedRoomId;
    let el: HTMLSelectElement = <HTMLSelectElement>(
      document.getElementById('rooms')
    );
    // el.selectedIndex = this.selectedRoomId;
    // console.log(el.selectedIndex);
    // console.log(el.value);
    this.roomEvents = this.events.filter(
      (event: any) => event.roomId == this.selectedRoomId
    );
    this.getEventDetailsFromEvent();
    // this.calendarOptions.events = this.roomEventsDetail;
    // console.log(this.calendarOptions.events);
    console.log(this.roomEvents);
  }

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
  navigateToEvents() {
    this.router.navigate(['/events'], {
      queryParams: { roomId: this.selectedRoomId },
    });
  }

  navigateToAdmin() {
    this.router.navigateByUrl('/admin');
  }
}
