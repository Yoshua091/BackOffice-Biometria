import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {catchError, map} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {AlertButtons, AlertComponent, AlertLevel} from './shared/alert/alert.component';
import {SessionService} from './core/session.service';
import {CODIGOS_RESP} from './core/constants';

@Injectable({
  providedIn: 'root'
})
export class AlertsInterceptor implements HttpInterceptor {

  // tslint:disable-next-line:variable-name
  private _requestStack = [];

  constructor(private modalService: NgbModal, private spinner: NgxSpinnerService, private session: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.headers.get("skip")){
      return next.handle(request);
    }

    if (this._requestStack.length === 0) {
      this.spinner.show();
    }

    this._requestStack.push(request.url);

    return next.handle(request).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          if (this._requestStack.length === 0) {
            this.spinner.hide();
          }
          if (request.method !== 'GET' && !request.url.includes('/login') && !CODIGOS_RESP.includes(event.body.codigo || event.body.codigoApp  )) {
            const alertRef = this.modalService.open(AlertComponent, {centered: true});
            alertRef.componentInstance.title = 'Acción exitosa';
            alertRef.componentInstance.description = event.body.mensaje;
            alertRef.componentInstance.level = AlertLevel.SUCCES_LEVEL;

            setTimeout(() => alertRef.close(), 2000);
          }

          setTimeout(() => {
            this._requestStack = this._requestStack.filter(url => url !== request.url);

            if (this._requestStack.length === 0) {
              this.spinner.hide();
            }
          }, 720);
        }
        return event;
      }), catchError(err => {
        if (err instanceof HttpErrorResponse) {
          this.spinner.hide();
          const {result, componentInstance} = this.modalService.open(AlertComponent, {centered: true, backdrop: 'static'});

          componentInstance.description = 'Unexpected error';
          componentInstance.level = AlertLevel.DANGER_LEVEL;
          componentInstance.buttons = AlertButtons.INFO;

          if (err.error.mensaje || err.error.mensaje.mensaje ) {
            componentInstance.title = 'Ops! algo salió mal';
            if (typeof err.error.mensaje === 'object' && err.error.mensaje !== null) {
              componentInstance.description = `${err.error.mensaje.mensaje}`;
          } else {
              componentInstance.description = `${err.error.mensaje}`;
          }
          }
          if (err.error.errors) {
            const keys = Object.keys(err.error.errors);
            componentInstance.description = keys.map(key => err.error.errors[key]).join('\n');
          }

          if (err.status === 401 || err.error.codigo === '02SURO401-S00005') {
            componentInstance.description = 'Su sesión ha terminado o no tiene permisos suficientes';
          }

          result.then(value => {
            if (value && err.status === 401 || err.error.codigo === '02SURO401-S00005') {
              this.session.expire();
            }
          });
        }
        return throwError(err);
      }));
  }
}
