import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errormsg: undefined;
  userDetails = {
    emailId: '',
    password: '',
  };
  returnUrl: string = '/schedule';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private loader: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      emailId: ['', [Validators.required, Validators.email]],
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
    this.loader.start();
    this.authService.loginUser(this.userDetails).subscribe(
      (data: any) => {
        this.cookieService.set('user', JSON.stringify(data.data[0]), {
          expires: 3,
        });
        this.authService.currentUser = data.data[0];
        console.log(this.authService.currentUser);
        this.loader.stop();
        this.router.navigateByUrl(this.returnUrl, { replaceUrl: true });
      },
      (err) => {
        this.errormsg = err.error.msg;
        console.log('Error in credentials', err);
        this.loader.stop();
      }
    );
  }

  navigateToSignin() {
    this.router.navigateByUrl('/signin');
    this.errormsg = undefined;
  }

  onFocus() {
    this.errormsg = undefined;
  }

  onCancel() {
    this.location.back();
  }
}
