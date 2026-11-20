import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {strict} from 'assert';
import {stringify} from 'querystring';
import {ApiService} from '../core/data/api.service';
import {SessionService} from '../core/session.service';

@Injectable({
  providedIn: 'root'
})
export class SessionGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private apiService: ApiService, private session: SessionService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.session.token;

    if (token) {
      this.router.navigateByUrl('/');
    }

    return !token;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    /**
     * childRoute.url.forEach(async child => {
     *   if (!childRoute.params.token) { this.router.navigateByUrl('/'); }
     * });
     */

    return true;
  }

}
