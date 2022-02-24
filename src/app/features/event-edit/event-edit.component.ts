import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from '../booking/services/event.service';
import { AuthService } from '../services/auth.service';

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

  eventData: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventData = this.router.getCurrentNavigation()?.extras.state;
    this.event.eventId = this.eventData.eventData.eventId;
    this.event.userId = this.eventData.eventData.userId;
    this.event.roomId = this.eventData.eventData.roomId;
    // console.log(this.eventData);
    // console.log(this.event.userId);
    this.event.eventDetails.title = this.eventData.eventData.eventDetails.title;
    this.event.eventDetails.start = this.eventData.eventData.eventDetails.start;
    this.event.eventDetails.end = this.eventData.eventData.eventDetails.end;
    this.eventForm = this.fb.group({
      eventTitle: [this.event.eventDetails.title, [Validators.required]],
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

  ngOnInit(): void {}

  onSubmit() {
    this.event.eventDetails.title = this.eventForm.value['eventTitle'];
    // this.event.eventDetails.start = this.eventForm.value['eventStart'] + ':00';
    // this.event.eventDetails.end = this.eventForm.value['eventEnd'] + ':00';
    // this.event.userId = JSON.parse(this.cookieService.get('user')).userId;
    // this.event.roomId = this.roomId;

    console.log(this.event);
    // this.eventService.addEvent(this.event);
    // this.router.navigate(['/schedule'], {
    //   queryParams: { selectedRoomId: this.roomId },
    // });

    this.eventService.editEvent(this.event).subscribe(
      (data: any) => {
        this.router.navigate(['/myEvents']);
      },
      (err) => {
        console.log('Error in editing event', err);
      }
    );
  }
}
