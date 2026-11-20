import { Injectable } from '@angular/core';
import { ApiService } from './data/api.service';
import { User } from './entities/user';
import { AuthCredentials, Roles } from './types';
import { STORAGE_KEYS } from './constants';
import { Solicitudes } from './entities/solicitudes';
import { EstadoSolicitud } from './pipes/estado-solicitud.pipe';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // tslint:disable-next-line:variable-name
  private _expired: boolean;

  constructor(private api: ApiService) {
  }

  get expired(): boolean {
    return this._expired;
  }

  get token(): string {
    const local = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const session = sessionStorage.getItem(STORAGE_KEYS.TOKEN);

    return local ? local : session ? session : null;
  }

  get user(): User {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER));
    return local ? local : session ? session : null;
  }

  set user(user: User) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.USER));

    const result = local
      ? localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      : session ? sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
        : new Error('No user session data');
  }

  async login(credentials: AuthCredentials, options?: { remember: boolean }): Promise<any> {
    const { data, codigo, ...rest } = await this.api.authData.login(credentials);
    const { token, sucursales, roles, perfiles, user, config, config2, listadoUsuariosComite, listadoTasas, listadoComisiones, motor } = data || {};


    if (codigo === '02AUTHDAOO200-S00001') {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
      localStorage.setItem(STORAGE_KEYS.CONFIG2, JSON.stringify(config2.comunicados));
      localStorage.setItem(STORAGE_KEYS.SUCURSALES, JSON.stringify(sucursales));
      localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
      localStorage.setItem(STORAGE_KEYS.PERFILES, JSON.stringify(perfiles));
      localStorage.setItem(STORAGE_KEYS.PERMISOS, JSON.stringify(user.rol.permisosEjecucion));
      localStorage.setItem(STORAGE_KEYS.COMITE, JSON.stringify(listadoUsuariosComite));
      localStorage.setItem(STORAGE_KEYS.LISTADOTASAS, JSON.stringify(listadoTasas));
      localStorage.setItem(STORAGE_KEYS.LISTADOCOMISIONES, JSON.stringify(listadoComisiones));
      localStorage.setItem(STORAGE_KEYS.MOTOR, JSON.stringify(motor));
    }

    return { data, codigo, ...rest };
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
  }

  hasURLPermissions(url: string): boolean {
    let has = false;
    // extra en un string la url del menu de un usuario
    const extractURL = item => {
      if (item.type === 'link' || !item.type) {
        return `/${item.state}`;
      } else if (item.type === 'sub') {
        return item.children.map(extractURL).map(child => {
          return `/${item.state}${child}`;
        });
      }
    };

    // valida si la url en el browser puede renderizarse para el usuario actual
    const validate = item => {
      return typeof item === 'string' ?
        item === url || url.includes(item) :
        item.some(validate);
    };

    if (this.user) {
      const urlAllowed = this.user.rol.menu.map(extractURL);
      has = urlAllowed.some(validate);
    }

    return has;
  }

  hasSolicitudPermissions(propuesta: Solicitudes): boolean {
    const { id: rolId } = this.user.rol;
    const { estado } = propuesta;
    const { ValidacionAsistente, ValidacionGerente, Comite, ValidacionIdentidad, Dispersion, enDispersion, enDispersionEstado, Finalizada } = EstadoSolicitud;
    const { ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO } = Roles;
    const has = [];
    const puedeVerComite = this.comitePuedeVerPropuesta(propuesta);
    const soporte = propuesta.soporte?.soporte === true ? true : false;
    const estadoSoporte = estado >= EstadoSolicitud.AprobadaDesembolsada ? true : false;
    const esConsulta = rolId === CONSULTA && estado === EstadoSolicitud.Comite
    const puedeVerRolConsultaComite =
      [ADMIN, COMITE, COORDINADOCREDITO].includes(rolId) &&
      estado === EstadoSolicitud.Comite &&
      puedeVerComite;

    if (!soporte && !estadoSoporte) {
      has.push([ADMIN].includes(rolId) && [ValidacionAsistente, ValidacionGerente, Comite, ValidacionIdentidad, Dispersion, enDispersion, enDispersionEstado, Finalizada].includes(estado)); // todos
      has.push([ASISTENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionAsistente); // validacionPermitida
      has.push([GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionGerente); // aprobacionPermitida
      has.push(esConsulta || puedeVerRolConsultaComite); // comitePermitida
      has.push([ASISTENTE, GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA, COMITE].includes(rolId) && estado === EstadoSolicitud.ValidacionIdentidad); // otpPermitida
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.AprobadaDesembolsada); // aprobadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Rechazada); // rechazadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Devuelta); // devueltas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Dispersion); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersion); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersionEstado); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Finalizada); // finalizada
    } else if (!soporte && estadoSoporte) {
      has.push([ADMIN].includes(rolId) && [ValidacionAsistente, ValidacionGerente, Comite, ValidacionIdentidad, Dispersion, Finalizada].includes(estado)); // todos
      has.push([ASISTENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionAsistente); // validacionPermitida
      has.push([GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionGerente); // aprobacionPermitida
      has.push(esConsulta || puedeVerRolConsultaComite); // comitePermitida
      has.push([ASISTENTE, GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA, COMITE].includes(rolId) && estado === EstadoSolicitud.ValidacionIdentidad); // otpPermitida
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.AprobadaDesembolsada); // aprobadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Rechazada); // rechazadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Devuelta); // devueltas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Dispersion); // dispersion 
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersion); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersionEstado); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Finalizada); // finalizada
    } else if (soporte && estadoSoporte) {
      has.push([ADMIN].includes(rolId) && [ValidacionAsistente, ValidacionGerente, Comite, ValidacionIdentidad, Dispersion, Finalizada].includes(estado)); // todos
      has.push([ASISTENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionAsistente); // validacionPermitida
      has.push([GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.ValidacionGerente); // aprobacionPermitida
      has.push(esConsulta || puedeVerRolConsultaComite); // comitePermitida
      has.push([ASISTENTE, GERENTE, ADMIN, COORDINADOCREDITO, CONSULTA, COMITE].includes(rolId) && estado === EstadoSolicitud.ValidacionIdentidad); // otpPermitida
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.AprobadaDesembolsada); // aprobadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Rechazada); // rechazadas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, COORDINADOCREDITO, CONSULTA].includes(rolId) && estado === EstadoSolicitud.Devuelta); // devueltas
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Dispersion); // dispersion    
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersion); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.enDispersionEstado); // dispersion
      has.push([ASISTENTE, GERENTE, COMITE, ADMIN, CONSULTA, COORDINADOCREDITO].includes(rolId) && estado === EstadoSolicitud.Finalizada); // finalizada
    }



    return has.some(permission => permission);
  }

  permisos() {

  }

  comitePuedeVerPropuesta(propuesta: Solicitudes) {
    let analista;
    const currentUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const comite = JSON.parse(localStorage.getItem(STORAGE_KEYS.COMITE));
    const esLider = comite.find(user => user.idUsuario === currentUser.idUsuario)?.lider ? true : false;
    if (propuesta.comite) {
      analista = propuesta.comite.usuarioAsignado;
    }

    return currentUser.idUsuario === analista?.idUsuario || esLider
  }

  defaulURL(): string {
    const { rol: { menu } } = this.user;
    return menu.find(m => m.state === 'propuestas')?.state ||
      (menu[0].type === 'sub' ? `${menu[0].state}/${menu[0].children[0].state}` : menu[0].state);
  }

  expire(): void {
    this._expired = true;
    this.logout();
    window.location.reload();
  }
}
