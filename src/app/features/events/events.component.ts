import { Component, OnInit } from '@angular/core';
import { ThrowStmt } from '@angular/compiler';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  eventForm : FormGroup;
  eventDetails = {
    eventTitle:'',
    eventStart:'',
    eventEnd:'',
  };
  returnUrl: string = '/schedule';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) { 
    this.eventForm = this.fb.group({
      eventTitle: ['', [Validators.required]],
      eventStart:['',[Validators.required]],
      eventEnd:['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/schedule';
  }

  get eventTitle() {
    return this.eventForm.get('eventTitle');
  }
  get eventStart() {
    return this.eventForm.get('eventStart');
  }
  get eventEnd() {
    return this.eventForm.get('eventStart');
  }
  loginUser() {
    this.eventDetails.eventTitle = this.eventForm.value['eventTitle'];
    this.eventDetails.eventStart = this.eventForm.value['eventStart'];
    this.eventDetails.eventEnd = this.eventForm.value['eventEnd'];
    this.authService.loginUser(this.eventDetails).subscribe(
      (data: any) => {
        console.log(data);
        this.cookieService.set('user', JSON.stringify(data.data[0]), {
          expires: 3,
        });
        this.router.navigateByUrl(this.returnUrl);
      },
      (err) => {
        console.log('Error in credentials', err);
      }
    );
    }
}
