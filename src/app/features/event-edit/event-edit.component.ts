import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from '../booking/services/event.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css'],
})
export class EventEditComponent implements OnInit {
  eventForm: FormGroup;
  roomId: any;
  event: any = {
    eventId: '',
    userId: '',
    roomId: '',
    eventDetails: {
      title: '',
      start: '',
      end: '',
    },
  };
  selectedDate: string;
  errormsg: any = undefined;
  eventData: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private cookieService: CookieService,
    private loader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.eventData = this.router.getCurrentNavigation()?.extras.state;
    this.event.eventId = this.eventData.eventData.eventId;
    this.event.userId = this.eventData.eventData.userId;
    this.event.roomId = this.eventData.eventData.roomId;
    
    this.event.eventDetails.title = this.eventData.eventData.eventDetails.title;
    this.event.eventDetails.start = this.eventData.eventData.eventDetails.start;
    this.event.eventDetails.end = this.eventData.eventData.eventDetails.end;

    this.selectedDate = this.event.eventDetails.start.split('T')[0];
  
    var timeStart = this.event.eventDetails.start.split('T')[1];
    var timeEnd = this.event.eventDetails.end.split('T')[1];

    timeStart = timeStart.substring(0, 5);
    timeEnd = timeEnd.substring(0, 5);

    this.eventForm = this.fb.group({
      eventTitle: [this.event.eventDetails.title, [Validators.required]],
      eventStart: [timeStart, [Validators.required]],
      eventEnd: [timeEnd, [Validators.required]],
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

  ngOnInit(): void {}

  onSubmit() {
    this.event.eventDetails.title = this.eventForm.value['eventTitle'];
    this.event.eventDetails.start = this.eventForm.value['eventStart'] + ':00';
    this.event.eventDetails.end = this.eventForm.value['eventEnd'] + ':00';

    if (this.event.eventDetails.end < this.event.eventDetails.start) {
      this.errormsg = 'End time must be greater than start time';
      return;
    }
    this.eventService.isOverlapping(this.event, this.selectedDate).then(
      (isOverlap) => {
        if (isOverlap) {
          this.errormsg =
            'The event conflicts with another event. Please choose a time slot that is free.';
        } else {
          this.loader.start();
          this.eventService.editEvent(this.event, this.selectedDate).subscribe(
            (data: any) => {
              this.loader.stop();
              this.router.navigate(['/myEvents'], { replaceUrl: true });
            },
            (err) => {
              console.log('Error in editing event', err);
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
    this.location.back();
  }
}
