import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private cookieService: CookieService, private router: Router) {}

  isNotAuthenticated(): boolean {
    const user_cookie = this.cookieService.get('user');
    if (user_cookie) {
      const user = JSON.parse(this.cookieService.get('user'));
      if (user) {
        return false;
      }
    }
    return true;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.isNotAuthenticated()) {
      return true;
    }
    // this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
