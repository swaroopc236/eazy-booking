import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ConfirmedValidator } from './confirmed.validators';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  errormsg = undefined;
  signupForm: FormGroup;
  userDetails = {
    userName: '',
    emailId: '',
    password: '',
    confirmPassword: '',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private spinnerService: NgxSpinnerService,
    private router: Router
  ) {
    this.signupForm = this.fb.group(
      {
        userName: ['', [Validators.required, Validators.maxLength(15)]],
        emailId: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: ConfirmedValidator('password', 'confirmPassword'),
      }
    );
  }

  get userName() {
    return this.signupForm.get('userName');
  }
  get emailId() {
    return this.signupForm.get('emailId');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }
  get f() {
    return this.signupForm.controls;
  }
  ngOnInit(): void {}

  comparePasswords(p: string, cp: string): boolean {
    if (p === cp) {
      return true;
    }
    return false;
  }

  signupUser() {
    let confirmPassword = this.signupForm.value['confirmPassword'];
    this.userDetails.password = this.signupForm.value['password'];
    if (this.comparePasswords(this.userDetails.password, confirmPassword)) {
      this.userDetails.userName = this.signupForm.value['userName'];
      this.userDetails.emailId = this.signupForm.value['emailId'];
      this.spinnerService.show();
      this.authService.signupUser(this.userDetails).subscribe(
        (data: any) => {
          this.cookieService.set('user', JSON.stringify(data.data[0]), {
            expires: 3,
          });
          this.spinnerService.hide();
          this.router.navigate(['login']);
        },

        (err: any) => {
          this.errormsg = err.error.msg;
          console.log('Error while registering', this.errormsg);
          this.spinnerService.hide();
        }
      );
    } else {
      console.log('mismatch');
    }
  }
  //cheackEmail(control : FormControl): Promise<any> | Observable<any> {
  onFocus() {
    this.errormsg = undefined;
  }
}
