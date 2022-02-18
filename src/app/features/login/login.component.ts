import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userDetails = {
    emailId: '',
    password: '',
  };
  returnUrl: string = '/schedule';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/schedule';
  }

  get emailId() {
    return this.loginForm.get('emailId');
  }
  get password() {
    return this.loginForm.get('password');
  }

  loginUser() {
    this.userDetails.emailId = this.loginForm.value['emailId'];
    this.userDetails.password = this.loginForm.value['password'];
    this.authService.loginUser(this.userDetails).subscribe(
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
