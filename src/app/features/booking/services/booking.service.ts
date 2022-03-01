import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { EventSourceInput } from '@fullcalendar/angular';
import { Observable, Subject } from 'rxjs';
import { interval, timer } from 'rxjs';
import { concatMap, retry, share, switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BookingService implements OnDestroy {
  events: EventSourceInput = [];
  TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // today's date

  pollingData: any;
  // private events$: Observable<any[]>;
  private stopPolling = new Subject();

  constructor(private http: HttpClient) {
    // mock events
    this.events = [
      {
        title: 'Event 1',
        start: this.TODAY_STR + 'T14:00:00',
        end: this.TODAY_STR + 'T15:00:00',
      },
      {
        title: 'Event 2',
        start: this.TODAY_STR + 'T09:30:00',
        end: this.TODAY_STR + 'T10:00:00',
      },
      {
        title: 'Event 3',
        start: this.TODAY_STR + 'T11:00:00',
        end: this.TODAY_STR + 'T12:00:00',
      },
      {
        title: 'Event 4',
        start: this.TODAY_STR + 'T18:45:00',
        end: this.TODAY_STR + 'T19:37:00',
      },
      {
        title: 'Event 5',
        start: this.TODAY_STR + 'T13:00:00',
        end: this.TODAY_STR + 'T13:30:00',
      },
    ];

    // this.events$ = timer(1, 10000).pipe(
    //   concatMap(() => this.http.get<any[]>('http://localhost:5000/users')),
    //   retry(),
    //   share(),
    //   takeUntil(this.stopPolling)
    // );
  }

  getEvents() {
    // this.http.get('http://localhost:6000/users');
    // this.pollingData = interval(5000)
    //   .switchMap(() => this.http.get('http://localhost:6000/users'))
    //   .map((data: any) => data.json())
    //   .subscribe((data: any) => {
    //     console.log(data); // see console you get output every 5 sec
    //   });
    return this.events;
  }

  // getAllEvents(): Observable<any[]> {
  //   return this.events$;
  // }

  ngOnDestroy(): void {
    this.stopPolling.next();
  }
}
