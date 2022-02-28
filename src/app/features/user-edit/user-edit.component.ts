import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
})
export class UserEditComponent implements OnInit {
  userData: any;
  userEditForm: FormGroup;
  userDetails = {
    userName: '',
    emailId: '',
    password: '',
  };
  userId: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.userData = this.router.getCurrentNavigation()?.extras.state;
    this.userDetails.userName = this.userData.userData.userName;
    this.userDetails.emailId = this.userData.userData.emailId;
    this.userId = this.userData.userData.userId;
    console.log(this.userDetails);
    this.userEditForm = this.fb.group({
      userName: [this.userDetails.userName, [Validators.required]],
      emailId: [this.userDetails.emailId, [Validators.required]],
      oldPassword: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  get userName() {
    return this.userEditForm.get('userName');
  }
  get emailId() {
    return this.userEditForm.get('emailId');
  }
  get oldPassword() {
    return this.userEditForm.get('oldPassword');
  }
  get password() {
    return this.userEditForm.get('password');
  }
  get confirmPassword() {
    return this.userEditForm.get('confirmPassword');
  }

  ngOnInit(): void {}

  comparePasswords(p: string, cp: string): boolean {
    if (p === cp) {
      return true;
    }
    return false;
  }

  updateUser() {
    let confirmPassword = this.userEditForm.value['confirmPassword'];
    this.userDetails.password = this.userEditForm.value['password'];
    if (this.comparePasswords(this.userDetails.password, confirmPassword)) {
      this.userDetails.userName = this.userEditForm.value['userName'];
      this.userDetails.emailId = this.userEditForm.value['emailId'];
      this.authService.updateUser(this.userId, this.userDetails).subscribe(
        (data: any) => {
          // console.log(data);
          // this.cookieService.set('user', JSON.stringify(data.data[0]), {
          //   expires: 3,
          // });
          // this.router.navigate(['login']);
          this.authService.logoutUser().subscribe(
            (data) => {
              console.log(data);
              this.cookieService.delete('user');
            },
            (err) => {
              console.log('Error while logging out', err);
            }
          );
        },
        (err: any) => {
          console.log('Error while updating', err);
        }
      );
      // this.authService.updateUser(this.userId, this.userDetails);
    } else {
      console.log('mismatch');
    }
  }
}
