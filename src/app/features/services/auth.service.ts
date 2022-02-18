import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements CanActivate {
  private USERS_URL = 'https://eazy-booking-staging.herokuapp.com/users';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  loginUser(userDetails: any) {
    console.log(userDetails);
    return this.http.post(`${this.USERS_URL}/login`, userDetails);
  }

  logoutUser() {
    return this.http.get(`${this.USERS_URL}/logout`);
  }

  signupUser(userDetails: any) {
    console.log(userDetails);
    return this.http.post(`${this.USERS_URL}/signup`, userDetails);
  }

  isAuthenticated(): boolean {
    const user_cookie = this.cookieService.get('user');
    if (user_cookie) {
      const user = JSON.parse(this.cookieService.get('user'));
      console.log(user);
      if (user) {
        return true;
      }
    }
    return false;
  }

  isAdmin(): boolean {
    if (this.isAuthenticated()) {
      const user = JSON.parse(this.cookieService.get('user'));
      if (user.isAdmin) {
        return true;
      }
    }
    return false;
  }

  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
