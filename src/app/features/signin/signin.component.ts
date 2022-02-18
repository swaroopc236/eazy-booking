import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  signupForm: FormGroup;
  userDetails = {
    userName: '',
    emailId: '',
    password: '',
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      userName: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
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
      this.authService.signupUser(this.userDetails).subscribe(
        (data: any) => {
          // console.log(data);
          this.cookieService.set('user', JSON.stringify(data.data[0]), {
            expires: 3,
          });
          this.router.navigate(['login']);
        },
        (err: any) => {
          console.log('Error while registering', err);
        }
      );
    } else {
      console.log('mismatch');
    }
  }
}
