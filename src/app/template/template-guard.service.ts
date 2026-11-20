import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionService} from '../core/session.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private session: SessionService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.session.token;

    if (!token) {
      this.router.navigateByUrl('/session');
    } else {
      if (state.url === '/') {
        this.router.navigateByUrl(this.session.defaulURL());
      }
    }

    return !!token;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.session.hasURLPermissions(state.url);
  }

}
