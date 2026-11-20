import { Injectable } from '@angular/core';
import { UsuariosDataService } from './usuarios-data.service';
import { SucursalesService } from './sucursales-data.servie';
import { AuthDataService } from './auth-data.service';
import { SolicitudesDataService } from './solicitudes-data.service';
import { MetasDataService } from './metas-data.service';
import { ReferenciasDataService } from './referencias-data.service';
import { PlazosDataService } from './plazos-data.service';
import { VinculacionDataService } from './vinculacion-data.service';
import { ReportesDataService } from './reportes-data.service';
import { ZonasDataService } from './zonas-data.service';
import { CobranzasDataService } from './cobranzas-data.service';
import { RenovacionesService } from './renovaciones.service';
import { RolesDataService } from './roles-data.service';
import { SolicitudesSoporteService } from './solicitudes-soporte.service';
import { BancolombiaDataService } from './bancolombia-data.service';
import { DispersionesService } from './dispersiones.service';
import { MarcacionesDataService } from './marcaciones-data.service';
import { ComunicadosDataService } from './comunicados-data.service';
import { VentaSegurosDataService } from './venta-seguros-data.service';
import { RegionalesDataService } from './regionales-data.service';
import { SegurosOtpService } from './seguros-otp.service';
import { MotorDataService } from './motor-data.service';
import { PreguntasDataService } from './preguntas-data.service';
import { BiometriaDataService } from './biometria-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    public authData: AuthDataService,
    public solicitudes: SolicitudesDataService,
    public metas: MetasDataService,
    public sucursales: SucursalesService,
    public usuarios: UsuariosDataService,
    public referencias: ReferenciasDataService,
    public plazos: PlazosDataService,
    public vinculacion: VinculacionDataService,
    public reportes: ReportesDataService,
    public zonas: ZonasDataService,
    public cobranzas: CobranzasDataService,
    public renovaciones: RenovacionesService,
    public roles: RolesDataService,
    public solicitudesSoporte: SolicitudesSoporteService,
    public bancolombiaDispersiones: BancolombiaDataService,
    public dispersiones: DispersionesService,
    public marcaciones: MarcacionesDataService,
    public comunicaciones: ComunicadosDataService,
    public ventaSeguros: VentaSegurosDataService,
    public ventaSegurosOtp: SegurosOtpService,
    public regionales: RegionalesDataService,
    public motor: MotorDataService,
    public preguntas: PreguntasDataService,
    public biometria: BiometriaDataService
  ) {
  }
}

// TODO: reubicar interface al archivo core/types.ts
export interface ResponseStruct<T> {
  error: boolean;
  mensaje: string;
  comite?: any,
  status: number;
  data: T;
  codigo: string;
}
