import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
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
  event: any = {
    userId: '',
    roomId: '',
    eventDetails: {
      title: '',
      start: '',
      end: '',
    },
  };

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private cookieService: CookieService,
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
  }

  onSubmit() {
    this.event.eventDetails.title = this.eventForm.value['eventTitle'];
    this.event.eventDetails.start = this.eventForm.value['eventStart'] + ':00';
    this.event.eventDetails.end = this.eventForm.value['eventEnd'] + ':00';
    this.event.userId = JSON.parse(this.cookieService.get('user')).userId;
    this.event.roomId = this.roomId;

    console.log(this.event);
    // this.eventService.addEvent(this.event);
    // this.router.navigate(['/schedule'], {
    //   queryParams: { selectedRoomId: this.roomId },
    // });

    this.eventService.addEvent(this.event).subscribe(
      (data: any) => {
        this.router.navigate(['/schedule'], {
          queryParams: { selectedRoomId: this.roomId },
        });
      },
      (err) => {
        console.log('Error in adding event', err);
      }
    );
  }
}
