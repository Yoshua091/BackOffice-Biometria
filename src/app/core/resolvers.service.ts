import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService, ResponseStruct} from './data/api.service';
import {Solicitudes} from './entities/solicitudes';
import {LazyLoadScriptService} from './lazy-load-scripts.service';
import * as moment from 'moment';
import {Rol} from './entities/rol';

/**
 * @Injectable({ providedIn: 'root' })
 * export class UsersResolver implements Resolve<ResponseStruct<User[]>> {
 *   constructor(private api: ApiService) {}
 *
 *   resolve(
 *     route: ActivatedRouteSnapshot,
 *     state: RouterStateSnapshot
 *   ): Observable<any>|Promise<any>|any {
 *     return this.api.usersData.all();
 *   }
 *
 */

@Injectable({providedIn: 'root'})
export class SolicitudResolver implements Resolve<ResponseStruct<Solicitudes>> {
  constructor(private api: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    const {_id} = route.queryParams;
    return this.api.solicitudes.buscarPorId({_id});
  }
}

@Injectable({providedIn: 'root'})
export class SucursalesResolver implements Resolve<ResponseStruct<Solicitudes>> {
  constructor(private api: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.sucursales.buscar();
  }
}

declare let simulador;

@Injectable({providedIn: 'root'})
export class SimuladorResolver implements Resolve<ResponseStruct<Blob>> {
  constructor(private api: ApiService, private lazyloadScripts: LazyLoadScriptService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.solicitudes.buscarScriptSimulador()
      .then(async (simuladorjs) => {
        return new Promise<FileReader>((resolve, reject) => {
          const fr = new FileReader();

          fr.onloadend = async _ => {
            await this.lazyloadScripts.loadScript('simulador', fr.result as string).toPromise();
            simulador = typeof simulador === 'function' ? simulador(moment) : simulador;
            resolve(simulador);
          };

          fr.onerror = async _ => {
            reject(_);
          };

          fr.readAsDataURL(simuladorjs);
        });
      });
  }
}

@Injectable({providedIn: 'root'})
export class OpcionesVinculacionResolver implements Resolve<ResponseStruct<any>> {
  constructor(private api: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.vinculacion.buscar();
  }
}


@Injectable({providedIn: 'root'})
export class OpcionesReportesResolver implements Resolve<ResponseStruct<any>> {
  constructor(private api: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.reportes.buscar();
  }
}

@Injectable({providedIn: 'root'})
export class RolesResolver implements Resolve<ResponseStruct<Rol>> {
  constructor(private api: ApiService) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.api.roles.buscar();
  }
}
