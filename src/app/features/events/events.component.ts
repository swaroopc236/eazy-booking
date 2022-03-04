import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EventService } from '../booking/services/event.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  eventForm: FormGroup;
  roomId: any;
  events: any;
  roomEvents: any;
  selectedDate: any;
  selectedTime = {
    startTime: '',
    endTime: '',
  };
  event: any = {
    userId: '',
    roomId: '',
    eventDetails: {
      title: '',
      start: '',
      end: '',
    },
  };
  errormsg: any = undefined;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private cookieService: CookieService,
    private loader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      eventTitle: ['', [Validators.required]],
      eventStart: ['', [Validators.required]],
      eventEnd: ['', [Validators.required]],
    });
  }

  get eventTitle() {
    return this.eventForm.get('eventTitle');
  }
  get eventStart() {
    return this.eventForm.get('eventStart');
  }
  get eventEnd() {
    return this.eventForm.get('eventEnd');
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.queryParams['roomId'];
    this.selectedDate = this.route.snapshot.queryParams['selectedDate'];
    this.selectedTime.startTime = this.route.snapshot.queryParams['startTime'];
    this.selectedTime.endTime = this.route.snapshot.queryParams['endTime'];
    console.log(this.selectedDate);
    console.log(this.selectedTime);
    this.eventForm.get('eventStart')?.setValue(this.selectedTime.startTime);
    this.eventForm.get('eventEnd')?.setValue(this.selectedTime.endTime);
  }

  onSubmit() {
    this.event.eventDetails.title = this.eventForm.value['eventTitle'];
    this.event.eventDetails.start = this.eventForm.value['eventStart'] + ':00';
    this.event.eventDetails.end = this.eventForm.value['eventEnd'] + ':00';
    this.event.userId = JSON.parse(this.cookieService.get('user')).userId;
    this.event.roomId = this.roomId;

    console.log(this.event);
    if (this.event.eventDetails.end < this.event.eventDetails.start) {
      this.errormsg = 'End time must be greater than start time';
      return;
    }

    this.eventService.isOverlapping(this.event, this.selectedDate).then(
      (isOverlap) => {
        if (isOverlap) {
          this.errormsg =
            'The event you are trying to create conflicts with another event. Try changing the time or room.';
        } else {
          this.loader.start();
          this.eventService.addEvent(this.event, this.selectedDate).subscribe(
            (data: any) => {
              this.loader.stop();
              this.router.navigate(['/schedule'], {
                queryParams: {
                  selectedRoomId: this.roomId,
                  selectedDate: this.selectedDate,
                },
                replaceUrl: true,
              });
            },
            (err) => {
              console.log('Error in adding event', err);
              this.loader.stop();
            }
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/schedule'], {
      queryParams: {
        selectedRoomId: this.roomId,
        selectedDate: this.selectedDate,
      },
      replaceUrl: true,
    });
  }
}
