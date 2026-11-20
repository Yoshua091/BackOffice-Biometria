import { ApplicationRef, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

import { ApiService, ResponseStruct } from '../../core/data/api.service';
import { ResultadoBiometria } from '../../core/data/biometria-data.service';
import { Cliente, Foto, Solicitudes } from '../../core/entities/solicitudes';
import { EstadoSolicitud } from '../../core/pipes/estado-solicitud.pipe';
import { arrayBufferToBase64, blobToBase64, CamposEditables, nombreCompletoMiembro, STORAGE_KEYS, TipoDestinoPrestamo } from '../../core/constants';
import { SessionService } from '../../core/session.service';
import { PermisosComponentes, Roles, TiposMiembro, TipoSolicitud, TiposReferencias } from '../../core/types';
import { FinDeSemanaPipe } from '../../core/pipes/fin-de-semana.pipe';
import { DataSolicitudPipe } from 'src/app/core/pipes/data-solicitud.pipe';
import { MontoVentasKeys } from '../../core/pipes/detalle-metodos.pipe';
import { Permisos } from 'src/app/core/entities/permisos';
import { ModoModalAprobarImagen, ValidarDocsModalComponent } from '../modales/validar-docs-modal/validar-docs-modal.component';
import { RechazarDocsModalComponent } from '../modales/rechazar-docs-modal/rechazar-docs-modal.component';
import { ConfirmarRefComponent } from '../modales/confirmar-ref/confirmar-ref.component';
import { ValidarOtpComponent } from '../modales/validar-otp/validar-otp.component';
import { HistorialComponent } from '../modales/historial/historial.component';
import { AjustarMontosComponent } from '../modales/ajustar-montos/ajustar-montos.component';
import { environment } from '../../../environments/environment';
import { EdicionCamposModalComponent } from '../modales/edicion-campos-modal/edicion-campos-modal.component';
import { AlertButtons, AlertComponent, AlertLevel } from '../../shared/alert/alert.component';
import { DetalleMetodosComponent } from '../modales/detalle-metodos/detalle-metodos.component';
import { CausalRechazoDevolucionComponent } from '../modales/causal-rechazo-devolucion/causal-rechazo-devolucion.component';
import { DetalleMontosComponent } from '../modales/detalle-montos/detalle-montos.component';
import { CreditosClienteComponent } from '../modales/creditos-cliente/creditos-cliente.component';
import { Configuracion } from '../../core/entities/configuracion';
import { NgxSpinnerService } from 'ngx-spinner';
import { CausalDevolucionComponent } from '../modales/causal-devolucion/causal-devolucion.component';
import { DistanciaFotosModalComponent } from '../modales/distancia-fotos-modal/distancia-fotos-modal.component';
import { AgePipe } from 'src/app/core/pipes/age.pipe';
import { ValidarSegurosModalComponent } from '../modales/validar-seguros-modal/validar-seguros-modal.component';
import { CargosFijosComponent } from '../modales/cargos-fijos/cargos-fijos.component';
import { GenerarPreguntasComponent } from '../modales/generar-preguntas/generar-preguntas.component';
import { EdicionDesembolsoComponent } from '../modales/edicion-desembolso/edicion-desembolso.component';
import { VentaSegurosComponent } from '../modales/venta-seguros/venta-seguros.component';
import { BuscarCoincidenciasModalComponent } from '../modales/buscar-coincidencias-modal/buscar-coincidencias-modal.component';


declare let simulador;

const { REGISTROS_VENTAS, BUENOS_MALOS, POR_PERIODO, COMPRAS_PROVEEDORES } = MontoVentasKeys;

@Component({
  selector: 'app-detalle-propuesta',
  templateUrl: './detalle-propuesta.component.html',
  styleUrls: ['./detalle-propuesta.component.scss'],
  providers: [
    DataSolicitudPipe,
    FinDeSemanaPipe,
    AgePipe
  ]
})
export class DetallePropuestaComponent implements OnInit {

  permitePasoValidarIdentidad = false;
  montoVentasKeys = { REGISTROS_VENTAS, BUENOS_MALOS, POR_PERIODO, COMPRAS_PROVEEDORES };
  montoMaxAprobacion: number;
  plazoMaxAprobacion: number;
  solicitud: Solicitudes;
  detalleClienteDesplegado: { [key: string]: boolean } = {};
  forzarOTPForm: { [key: string]: ForzarOTPForm };
  aprobacionesForm: { [key: string]: AprobacionesForm };
  aprobacionesHistorialForm: { [key: string]: AprobacionesHistorialForm };
  permisos: Permisos[];
  paisMiembro: String
  lugarExpedicion: string;
  solicitudFotos: Solicitudes;

  mostrarDatosFotos: any[];
  mostrarDatosFirmas: any[];
  deshabilitarCheckFotos: boolean;
  deshabilitarCheckFirmas: boolean;
  fotoEncontrada: any
  mensajes: any[] = [];

  resultadoSimulador: any = {};
  clientesContrato: (miembros: Cliente[]) => number;
  sumCuotas: (solicitud: Solicitudes) => number;
  lider: (miembros: Cliente[]) => any;
  cuotaGrupal: (solicitud: Solicitudes, fechaCredito: string) => any;
  simuladorMotor: (solicitud: Solicitudes, fechaCredito: string) => any;
  cuotaMax: (miembro: Cliente) => number;
  cuotaMaxCodeudorAsalariado: (miembro: Cliente) => number;
  tienePermiso: boolean;
  biometriaEnProceso = false;
  resultadoBiometriaSesion: { _id: string, tipo: ResultadoBiometria } = null;

  constructor(
    private api: ApiService,
    private modal: NgbModal,
    public route: ActivatedRoute,
    public session: SessionService,
    public dataSolicitudPipe: DataSolicitudPipe,
    public finDeSemanaPipe: FinDeSemanaPipe,
    public configs: Configuracion,
    private spinner: NgxSpinnerService,
    private edad: AgePipe,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) {
    const { data } = this.route.snapshot.data.solicitud as ResponseStruct<Solicitudes[]>;
    this.deshabilitarCheckFotos = false;
    this.deshabilitarCheckFotos = false;

    this.montosGerente();
    this.tienePermiso = false;

    this.prepararSimulador();
    this.solicitudFotos = new Solicitudes();
    this.solicitudFotos = data[0];
    this.updateSolicitud(data[0]);

    Object.keys(this.aprobacionesForm || {})
      .forEach(key => this.aprobacionesForm[key].valueChanges.subscribe(() => this.aprobarRevision(this.aprobacionesForm[key], key)));
    Object.keys(this.forzarOTPForm || {})
      .forEach(key => this.forzarOTPForm[key].valueChanges.subscribe(() => this.aprobarOTP(this.forzarOTPForm[key])));
    Object.keys(this.aprobacionesHistorialForm || {})
      .forEach(key => this.aprobacionesHistorialForm[key].valueChanges.subscribe(() => this.aprobarRevisionHistorial(this.aprobacionesHistorialForm[key])))

    this.solicitud.miembros
      .forEach(m => this.detalleClienteDesplegado[m.datosIdentificacionCliente.numeroIdentificacion] = false);

  }

  get esClienteExperto(): boolean {
    return this.solicitud.miembros.length === 1 &&
      this.solicitud.miembros.every(m => m.tipoMiembro.id === TiposMiembro.CLIENTE_EXPERTO);
  }

  get esIndividual(): boolean {
    const { miembros } = this.solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);
    const { CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE } = TiposMiembro;

    return miembros.every((m, idx) => idx === liderIdx ? true :
      [CODEUDOR_ASALARIADO, CODEUDOR_INDEPENDIENTE].includes(m.tipoMiembro.id));
  }

  get esGrupal(): boolean {
    const { miembros } = this.solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.MIEMBRO);
  }

  get esGarantia(): boolean {
    const { miembros } = this.solicitud;
    const liderIdx = miembros.findIndex(m => m.tipoMiembro.id === TiposMiembro.LIDER_GARANTIA);

    return miembros.every((m, idx) => idx === liderIdx ? true : m.tipoMiembro.id === TiposMiembro.LIDER_GARANTIA);
  }

  get tipoSolicitud(): TipoSolicitud {
    return this.esClienteExperto ? TipoSolicitud.CLIENTE_EXPERTO :
      this.esIndividual ? TipoSolicitud.INDIVIDUAL :
        this.esGarantia ? TipoSolicitud.INDIVIDUAL_CON_GARANTIA :
          this.esGrupal ? TipoSolicitud.GRUPAL :
            TipoSolicitud.INDEFINIDA;
  }

  get puedeEditarCampos(): boolean {
    const { ValidacionAsistente, ValidacionGerente, AprobadaDesembolsada } = EstadoSolicitud;
    const { GERENTE, ASISTENTE } = Roles;

    return [ValidacionAsistente, ValidacionGerente, AprobadaDesembolsada].includes(this.solicitud.estado)
      && [GERENTE, ASISTENTE].includes(this.session.user.rol.id);
  }

  get puedeEditarDesembolso(): boolean {
    const { Dispersion, enDispersion, enDispersionEstado } = EstadoSolicitud;
    const { ASISTENTE } = Roles;

    return [Dispersion, enDispersion, enDispersionEstado].includes(this.solicitud.estado)
      && [ASISTENTE].includes(this.session.user.rol.id);
  }

  get edadMaxima(): boolean {
    const { miembros } = this.solicitud;
    const diasMaximo = 27675;
    let birthdate = new Date();
    let dias;
    miembros.every((m) => {
      birthdate = new Date(m.datosPersonalesCliente.fechaNacimiento);
      const today = moment();
      const diasFecha = today.diff(birthdate, 'days');
      dias = diasFecha > diasMaximo ? true : false;
    });
    return dias;
  }

  clienteSoat(): boolean {
    return this.solicitud?.miembros?.some(m => m?.tipoMiembro?.soat === true);
  }

  mostrarBotonDevolver(): boolean {
    const estado = this.solicitud.estado;
    const rolId = this.session.user.rol.id;

    if ([
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite,
      EstadoSolicitud.ValidacionIdentidad].includes(estado) && rolId !== Roles.GERENTE) return true;
    if ([
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) &&
      [Roles.GERENTE, Roles.COORDINADOCREDITO].includes(rolId) && [
        EstadoSolicitud.ValidacionGerente,
        EstadoSolicitud.ValidacionIdentidad,
        EstadoSolicitud.Comite].includes(estado)) return true;
    if (rolId === Roles.ASISTENTE && estado === 45) return true;

    return false;
  }

  mostrarBotonComiteDecision(): boolean {
    return this.solicitud.estado === EstadoSolicitud.ValidacionGerente && [Roles.GERENTE, Roles.COORDINADOCREDITO].includes(this.session.user.rol.id);
  }

  mostrarBotonRechazar(): boolean {
    const estado = this.solicitud.estado;
    const rolId = this.session.user.rol.id;

    const condicion1 = [
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite,
      EstadoSolicitud.ValidacionIdentidad].includes(estado) && rolId !== Roles.GERENTE;
    const condicion2 = [
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) && (rolId === Roles.GERENTE && [
        EstadoSolicitud.ValidacionGerente,
        EstadoSolicitud.ValidacionIdentidad].includes(estado));
    const condicion3 = (rolId === Roles.ASISTENTE && [EstadoSolicitud.ValidacionAsistente].includes(estado));
    const condicion4 = rolId === Roles.COORDINADOCREDITO && [
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite,
      EstadoSolicitud.ValidacionIdentidad].includes(estado);

    return condicion1 || condicion2 || condicion3 || condicion4;;
  }

  mostrarBotonEnviarOtp(): boolean {
    const estado = this.solicitud.estado;
    const rolId = this.session.user.rol.id;

    const condicion1 = [
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) && rolId !== Roles.GERENTE;
    const condicion2 = [
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) && rolId === Roles.GERENTE && [
        EstadoSolicitud.ValidacionGerente].includes(estado);
    const condicion3 = rolId === Roles.COORDINADOCREDITO && [
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado);

    return condicion1 || condicion2 || condicion3;
  }

  mostrarBotonEnviarAprobacion(): boolean {
    const estado = this.solicitud?.estado;
    const rolId = this.session?.user?.rol?.id;

    return (
      ([EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.Comite,
      EstadoSolicitud.ValidacionIdentidad].includes(estado) && rolId !== Roles.GERENTE) ||
      (estado === EstadoSolicitud.ValidacionAsistente && rolId === Roles.COORDINADOCREDITO)
    );
  }


  mostrarBotonGPS(): boolean {
    const estado = this.solicitud.estado;
    const rolId = this.session.user.rol.id;

    if ([
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.Comite].includes(estado) && rolId !== Roles.GERENTE) {
      return true;
    }

    if ([
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) && rolId === Roles.GERENTE && [50].includes(estado)) {
      return true;
    }

    if (estado === EstadoSolicitud.ValidacionAsistente && rolId === Roles.ASISTENTE) {
      return true;
    }

    if ([
      EstadoSolicitud.ValidacionAsistente,
      EstadoSolicitud.ValidacionGerente,
      EstadoSolicitud.Comite].includes(estado) && rolId === Roles.COORDINADOCREDITO) {
      return true;
    }

    return false;
  }




  canalesContacto(idCanalBuscado, canalesContacto): any {
    if (this.solicitud.estado >= 100 && canalesContacto !== undefined) {
      const todosCanales = 99;
      const canalEncontrado = canalesContacto.find(canal => canal.idCanal === idCanalBuscado);
      const canalTodosEncontrados = canalesContacto.find(canal => canal.idCanal === todosCanales);
      if (canalTodosEncontrados && canalTodosEncontrados.autorizado) {
        return false;
      }
      // Verifica si se encontró el canal y si está autorizado
      else if (canalEncontrado && canalEncontrado.autorizado) {
        return false;
      } else {
        return true;
      }
    }
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date) {
    // const fecha = [
    //   date.getFullYear(),
    //   this.padTo2Digits(date.getMonth() + 1),
    //   this.padTo2Digits(date.getDate()),
    // ].join('-');
    // const hora = [
    //   date.toLocaleTimeString()
    // ].join('');
    // return fecha + ' ' + hora
    return date.toISOString();
  }




  get fechasCierre(): boolean {
    let mostrarCuadroDecision;
    if (this.solicitud.fechaEstados !== undefined && this.solicitud.estado !== EstadoSolicitud.Comite) {

      const fechaRecepcion = new Date(this.solicitud.fechaEstados[40]).getTime();
      const idSucursal = this.solicitud.sucursal._id
      const fechaActual = new Date().getTime()
      const fechasCierre = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)).bloqueoCierre;
      let cumpleRecepcion: boolean;
      cumpleRecepcion = false;
      let cumpleActual: boolean;
      cumpleActual = false
      let sucursalEncontrada: boolean
      sucursalEncontrada = false;


      for (const element of fechasCierre) {
        const fechaInicioCierre = new Date(element.fechaInicio).getTime();
        const fechaFinCierre = new Date(element.fechaFin).getTime();

        // Verifica si la sucursal actual coincide con una de las sucursales en el objeto fechasCierre
        const sucursalEncontrada = element.sucursales.includes(idSucursal);

        // Verifica si la fecha de recepción o la fecha actual caen dentro del rango de cierre
        const cumpleRecepcion = fechaInicioCierre <= fechaRecepcion && fechaFinCierre >= fechaRecepcion;
        const cumpleActual = fechaInicioCierre <= fechaActual && fechaFinCierre >= fechaActual;

        const plus = this.solicitud.tipoSolicitud.plus === true ? true : false
        if (sucursalEncontrada && (cumpleRecepcion && cumpleActual) && !plus) {
          return false; // La solicitud está bloqueada
        }
      }
    }
    return true; // La solicitud no está bloqueada
  }

  async ngOnInit(): Promise<void> {
    await this.validarDesembolsoEnCurso();
  }

  montosGerente() {
    const esGerenteRegional = this.session.user.rol.id === Roles.GERENTE && !!this.session.user?.sucursales;

    this.configs = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
    this.permisos = JSON.parse(localStorage.getItem(STORAGE_KEYS.PERMISOS));
    const usuario = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    const sucursal = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES));
    const usuarioMonto = usuario.sucursal.montoMaxAprobacionGrte !== undefined ? usuario.sucursal.montoMaxAprobacionGrte : 0
    const usuarioPlazo = usuario.sucursal.plazoMaxAprobacionGrte !== undefined ? usuario.sucursal.plazoMaxAprobacionGrte : 0
    this.montoMaxAprobacion = esGerenteRegional ? this.configs.montoMaxAprobacionGrteReg :
      !esGerenteRegional ? usuarioMonto : 0;
    this.plazoMaxAprobacion = esGerenteRegional ? this.configs.plazoMaxAprobacionGrteReg :
      !esGerenteRegional ? usuarioPlazo : 0;

  }

  async aprobarRevision(form: AprobacionesForm, numeroIdentificacion): Promise<void> {
    const { _id, miembros } = this.solicitud;
    this.mensajes = [];
    const miembroConIdentificacion = miembros.find(miembro => Number(miembro.datosIdentificacionCliente.numeroIdentificacion) === Number(numeroIdentificacion));

    if (miembroConIdentificacion) {
      // Iterar sobre los miembros para obtener los mensajes
      const tipoMiembro = miembroConIdentificacion.tipoMiembro;
      // Obtener los mensajes solo para el miembro con el mismo número de identificación
      this.mensajes.push(...this.fotosObligatorias(this.solicitud.fotos, tipoMiembro, this.solicitud?.tipoSolicitud, miembroConIdentificacion.fotos));
    }
    form.markAllAsTouched();
    this.checkAprobarFotos(miembros, form);

    if (form.valid && this.deshabilitarCheckFirmas && this.deshabilitarCheckFotos && this.mensajes.length === 0) {
      try {
        await this.api.solicitudes.aprobar({ _id, ...form.getRawValue() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    } else if (form.valid && this.deshabilitarCheckFirmas && !this.deshabilitarCheckFotos && form.controls.fotos.value === false && this.mensajes.length === 0) {
      try {
        await this.api.solicitudes.aprobar({ _id, ...form.getRawValue() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }

    } else if (form.valid && !this.deshabilitarCheckFirmas && this.deshabilitarCheckFotos && form.controls.firmas.value === false && this.mensajes.length === 0) {
      try {
        await this.api.solicitudes.aprobar({ _id, ...form.getRawValue() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    }
    else {
      if (this.mensajes.length > 0) {
        form.reset(miembros.find(m => m.datosIdentificacionCliente.numeroIdentificacion === form.identificacion));
        const result = this.modal.open(AlertComponent, { centered: true, size: 'lg' });
        result.componentInstance.title = 'Evaluar documentos';

        // Mensaje principal
        let description = `Para poder confirmar la evaluación de las fotos, todos los documentos deben estar aprobados.<br><br>`;

        // Verifica si hay mensajes adicionales
        if (this.mensajes.length > 0) {
          description += `Mensajes adicionales:<br><br>`;

          // Agrega mensajes adicionales con saltos de línea
          this.mensajes.forEach((mensaje, index) => {
            description += `${index + 1}. ${mensaje}<br>`;
          });
        }

        result.componentInstance.description = description;
        result.componentInstance.buttons = AlertButtons.INFO;
      }
      else {
        form.reset(miembros.find(m => m.datosIdentificacionCliente.numeroIdentificacion === form.identificacion));
        const result = this.modal.open(AlertComponent, { centered: true, size: 'lg' });
        result.componentInstance.title = 'Evaluar documentos';
        result.componentInstance.description = `Para poder confirmar la evaluación de las fotos, todos los documentos deben estar aprobados.`;
        result.componentInstance.buttons = AlertButtons.INFO;
      }
    }

  }
  async aprobarRevisionHistorial(form: AprobacionesHistorialForm): Promise<void> {
    const { _id, miembros } = this.solicitud;

    form.markAllAsTouched();

    if (form.valid) {
      try {
        await this.api.solicitudes.aprobar({ _id, ...form.getRawValue() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    } else {
      form.reset(miembros.find(m => m.datosIdentificacionCliente.numeroIdentificacion === form.identificacion));
    }
  }


  checkAprobarFotos(miembros, form) {
    const aprobada = 1;
    let fotosMiembro = [];
    let fotosMiembros = [];
    this.mostrarDatosFirmas = [];
    this.mostrarDatosFotos = [];
    fotosMiembros = this.solicitud.fotos
    miembros.forEach((element) => {
      if (element.datosIdentificacionCliente.numeroIdentificacion === form.identificacion)
        fotosMiembro = element.fotos;
    });
    for (const [keyFoto, idFoto] of Object.entries(fotosMiembro)) {
      if (fotosMiembros.length !== 0) {
        for (const elementMiembro of fotosMiembros) {
          const firma = elementMiembro.keyNombre.substr(0, 5);
          const foto = elementMiembro.keyNombre.substr(0, 4);

          if (firma === 'firma' && elementMiembro.Nombreid === idFoto && elementMiembro.keyNombre === keyFoto) {
            this.crearObjetoFirmasAprobadas(elementMiembro);
          }
          if (foto === 'foto' && elementMiembro.Nombreid === idFoto && elementMiembro.keyNombre === keyFoto) {
            this.crearObjetoFotosAprobadas(elementMiembro);
          }
        }
      }

      this.mostrarDatosFotos.every((m => m.aprobada === aprobada ? this.deshabilitarCheckFotos = true : this.deshabilitarCheckFotos = false));
      this.mostrarDatosFirmas.every((m => m.aprobada === aprobada ? this.deshabilitarCheckFirmas = true : this.deshabilitarCheckFirmas = false));
      // const tieneFirmaContrato = this.mostrarDatosFirmas.some(item => item.keyFoto === 'firmaContrato');
      // const tieneFirmaPagare = this.mostrarDatosFirmas.some(item => item.keyFoto === 'firmaPagare');

      // this.deshabilitarCheckFirmas = (tieneFirmaContrato && tieneFirmaPagare);
    }
  }

  crearObjetoFotosAprobadas(elementMiembro) {
    this.mostrarDatosFotos.push({
      aprobada: elementMiembro.aprobada,
      keyFoto: elementMiembro.keyNombre,
    });
  }

  crearObjetoFirmasAprobadas(elementMiembro) {
    this.mostrarDatosFirmas.push({
      aprobada: elementMiembro.aprobada,
      keyFoto: elementMiembro.keyNombre,
    });
  }

  async aprobarOTP(form: ForzarOTPForm): Promise<void> {
    const { _id, miembros } = this.solicitud;

    form.markAllAsTouched();

    if (form.valid) {
      try {
        await this.api.solicitudes.aprobarOTP({ _id, ...form.getRawValue() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    } else {
      form.reset(miembros.find(m => m.datosIdentificacionCliente.numeroIdentificacion === form.identificacion));
    }
  }

  async ajustarMontos(componente: number, accion: number, cliente: any, tipoSolicitudPlus: any, garantia: any, usuarioRegistra): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      let { data: plazos } = await this.api.plazos.prestamo();
      const { componentInstance, result } = await this.modal.open(AjustarMontosComponent, { centered: true, size: 'xl' });
      const solicitudJson = JSON.parse(JSON.stringify(this.solicitud));
      componentInstance.propuesta = solicitudJson;
      const idDestino = (this.dataSolicitudPipe.transform(solicitudJson.miembros, 'lider') as Cliente)?.solicitudEconomica?.valoresDetalles?.destinoPrestamo?.idDestino;
      if (idDestino == TipoDestinoPrestamo.find(x => x.name == 'Capital de trabajo').id && (tipoSolicitudPlus?.plus === false || tipoSolicitudPlus?.plus === undefined)) {
        plazos = plazos.slice(0, plazos.findIndex(x => x.meses == 18) + 1);
      }
      const capitalTrabajo = idDestino == TipoDestinoPrestamo.find(x => x.name == 'Capital de trabajo').id ? true : false
      componentInstance.plazos = plazos;
      componentInstance.tipoSolicitud = this.tipoSolicitud;
      componentInstance.cliente = cliente;
      componentInstance.plus = tipoSolicitudPlus?.plus;
      componentInstance.garantia = garantia;
      componentInstance.capitalTrabajo = capitalTrabajo;
      componentInstance.usuarioRegistra = usuarioRegistra;
      componentInstance.score = this.extractNumbers(cliente.estudioPreselecta?.resultado);
      componentInstance.miembrosLista = this.solicitud.miembros;
      componentInstance.renovacion = this.solicitud.renovacion;
      componentInstance.motor = this.solicitud.motor
      componentInstance.soat = this.clienteSoat();
      try {
        const { _id } = this.solicitud;
        const value = await result;
        await this.api.solicitudes.ajustarMonto({ _id, ...value });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.updateSolicitud(data[0]);
      } catch (e) {
      }
    }
  }

  extractNumbers(input: string): string {
    return input.replace(/\D/g, '');
  }

  async validarPreguntasOtp(cliente: Cliente, idSolicitud: string): Promise<void> {
    await this.abrirModalPreguntasSeguridadOtp(cliente, idSolicitud);

  }

  async validarIdentidad(cliente: Cliente, componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      await this.abrirModalOTP(cliente);
    }
  }

  async revisarEvidenciaFotografica(cliente: Cliente, componente: number, accion: number, fotos): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      await this.abrirModalRevisionDocs(cliente, ModoModalAprobarImagen.Documentos, fotos);
    }
  }

  get requiereValidacionBiometrica(): boolean {
    return [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionIdentidad]
      .includes(this.solicitud?.estado);
  }

  get titularBiometria(): Cliente {
    return this.solicitud?.miembros?.find(miembro =>
      Number(miembro?.solicitudEconomica?.valoresDetalles?.monto) > 0);
  }

  get biometriaInfo(): any {
    return (this.titularBiometria as any)?.biometria;
  }

  get resultadoBiometria(): ResultadoBiometria {
    const persistido = this.biometriaInfo?.validacionRealizada ? this.biometriaInfo?.resultadoBiometrico : null;
    const sesion = this.resultadoBiometriaSesion?._id === this.solicitud?._id
      ? this.resultadoBiometriaSesion.tipo : null;
    return persistido || sesion;
  }

  get biometriaAprobada(): boolean {
    return this.resultadoBiometria === ResultadoBiometria.ACEPTADO;
  }

  get mostrarBotonBiometria(): boolean {
    return this.requiereValidacionBiometrica && !this.resultadoBiometria;
  }

  get mostrarBotonCompararDatos(): boolean {
    return this.requiereValidacionBiometrica && this.resultadoBiometria === ResultadoBiometria.RECHAZO_DATOS;
  }

  get puedeValidarBiometria(): boolean {
    const titular = this.titularBiometria;
    if (!titular) return false;

    const fotos = this.fotosBiometria(titular);
    if (!titular.aprobacion?.fotos) return false;

    return fotos.every(foto => foto?.aprobada === 1);
  }

  accionesBiometriaHabilitadas(): boolean {
    return !this.requiereValidacionBiometrica || this.biometriaAprobada;
  }

  async validarBiometria(): Promise<void> {
    const titular = this.titularBiometria;
    const fotos = titular && this.fotosBiometria(titular);

    if (!titular || fotos.length !== 3 || fotos.some(foto => !foto) || !this.puedeValidarBiometria) {
      await this.mostrarAlertaBiometria(
        'Validación biométrica',
        'Las tres fotografías del titular deben existir y estar aprobadas antes de realizar la validación.',
        AlertLevel.WARNING_LEVEL);
      return;
    }

    this.biometriaEnProceso = true;
    try {
      const [fotoCliente, documentoAnverso, documentoReverso] = await Promise.all(
        fotos.map(foto => this.descargarFotoBiometria(foto)));
      const formData = new FormData();

      formData.append('documentoAnverso', documentoAnverso, 'documentoAnverso.png');
      formData.append('documentoReverso', documentoReverso, 'documentoReverso.png');
      formData.append('fotoCliente', fotoCliente, 'fotoCliente.png');
      formData.append('idSolicitud', String(this.solicitud.idSolicitud));

      const respuesta = await this.api.biometria.validar(formData);
      await this.procesarResultadoBiometria(respuesta);
    } catch (e) {
      await this.mostrarAlertaBiometria(
        'Error en validación biométrica',
        'No fue posible realizar la validación biométrica. La solicitud permanecerá sin cambios para intentar nuevamente.',
        AlertLevel.DANGER_LEVEL);
    } finally {
      this.biometriaEnProceso = false;
    }
  }

  private fotosBiometria(titular: Cliente): Foto[] {
    const keys = ['fotoCliente1', 'fotoDocumentoAnverso', 'fotoDocumentoReverso'];
    return keys.map(key => this.solicitud?.fotos?.find(foto => foto.id === titular?.fotos?.[key]));
  }

  private descargarFotoBiometria(foto: Foto): Promise<Blob> {
    return this.api.solicitudes.obtenerAdjuntoServerEstatico({
      _id: this.solicitud._id,
      nombre: foto.Nombreid as any
    });
  }

  private async procesarResultadoBiometria(respuesta: ResponseStruct<any>): Promise<void> {
    const data = respuesta?.data || {};
    const tipo = data.response?.tipo || ResultadoBiometria.ERROR_TECNICO;
    const mensaje = data.message || respuesta.mensaje;
    if (tipo !== ResultadoBiometria.ERROR_TECNICO) {
      this.resultadoBiometriaSesion = {_id: this.solicitud._id, tipo};
    }
    switch (tipo) {
      case ResultadoBiometria.ACEPTADO:
        await this.mostrarAlertaBiometria(
          'Validación biométrica exitosa',
          mensaje || 'La identidad y los datos del titular fueron validados correctamente.',
          AlertLevel.SUCCES_LEVEL);
        await this.recargarInformacion();
        break;
      case ResultadoBiometria.FALSO_POSITIVO:
        await this.mostrarAlertaBiometria(
          'Fotografías no válidas',
          mensaje || 'Las fotografías no son legibles. El cliente debe tomarlas nuevamente.',
          AlertLevel.WARNING_LEVEL);
        await this.devolverPorBiometria(respuesta);
        break;
      case ResultadoBiometria.RECHAZO_DATOS:
        await this.mostrarAlertaBiometria(
          'Datos no coinciden',
          this.mensajeDatosNoCoinciden(data, mensaje),
          AlertLevel.WARNING_LEVEL);
        break;
      case ResultadoBiometria.RECHAZADO:
        await this.mostrarAlertaBiometria(
          'Identidad no validada',
          mensaje || 'La validación biométrica fue rechazada.',
          AlertLevel.DANGER_LEVEL);
        await this.rechazarPorBiometria(respuesta);
        break;
      case ResultadoBiometria.ERROR_TECNICO:
      default:
        await this.mostrarAlertaBiometria(
          'Error en validación biométrica',
          mensaje || 'El servicio biométrico no respondió. Intente nuevamente.',
          AlertLevel.DANGER_LEVEL);
    }
  }

  private camposNoCoinciden(data: any): string {
    return (data?.comparacionDatos?.detalles || [])
      .filter(detalle => !detalle.coincide)
      .map(detalle => detalle.campo)
      .join(', ');
  }

  private mensajeDatosNoCoinciden(data: any, mensaje: string): string {
    const campos = this.camposNoCoinciden(data);
    const base = mensaje || 'La biometría fue aceptada, pero los datos no coinciden.';
    return campos ? `${base} Campos que no coinciden: ${campos}.` : base;
  }

  private async devolverPorBiometria(respuesta: ResponseStruct<any>): Promise<void> {
    const data = respuesta?.data || {};
    const mensaje = this.mensajeDatosNoCoinciden(data, data.message || respuesta.mensaje);
    const motivoRechazoDevolucion = {
      motivo: mensaje,
      descripcion: mensaje,
      fecha: moment().toISOString()
    };
    await this.modificarEstado(EstadoSolicitud.Devuelta, { motivoRechazoDevolucion });
  }

  private async rechazarPorBiometria(respuesta: ResponseStruct<any>): Promise<void> {
    const data = respuesta?.data || {};
    const mensaje = data.message || respuesta.mensaje || 'La validación biométrica fue rechazada.';
    const motivoRechazoDevolucion = {
      motivo: mensaje,
      descripcion: mensaje,
      fecha: moment().toISOString()
    };
    await this.modificarEstado(EstadoSolicitud.Anulada, { motivoRechazoDevolucion });
  }

  async compararDatosBiometria(): Promise<void> {
    const titular = this.titularBiometria;
    if (!titular || this.resultadoBiometria !== ResultadoBiometria.RECHAZO_DATOS) return;

    this.biometriaEnProceso = true;
    try {
      const respuesta = await this.api.biometria.compararDatos({
        idSolicitud: String(this.solicitud.idSolicitud)
      });
      await this.procesarResultadoBiometria(respuesta);
    } catch (e) {
      await this.mostrarAlertaBiometria(
        'Error en comparación de datos',
        'No fue posible realizar la comparación de datos. Intente nuevamente.',
        AlertLevel.DANGER_LEVEL);
    } finally {
      this.biometriaEnProceso = false;
    }
  }

  private async mostrarAlertaBiometria(title: string, description: string, level: AlertLevel): Promise<void> {
    const alerta = this.modal.open(AlertComponent, { centered: true });
    alerta.componentInstance.title = title;
    alerta.componentInstance.description = description;
    alerta.componentInstance.level = level;
    alerta.componentInstance.buttons = AlertButtons.INFO;
    try {
      await alerta.result;
    } catch (e) {
    }
  }

  async revisarFirmas(cliente: Cliente, componente: number, accion: number, fotos): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      await this.abrirModalRevisionDocs(cliente, ModoModalAprobarImagen.Firmas, fotos);
    }
  }

  async revisarSeguros(cliente: Cliente, componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      await this.abrirModalRevisionDocsSeguros(cliente, ModoModalAprobarImagen.Firmas, this.solicitud.fotos);
    }
  }

  async ventaSeguros(cliente: Cliente): Promise<void> {

    await this.abrirModalVentaSeguros(cliente);
  }

  async confirmarReferenciasArriendoLocal(cliente: Cliente): Promise<void> {
    await this.abrirModalConfirmarReferencias(cliente, TiposReferencias.ARRIENDO_LOCAL);
  }

  async confirmarReferenciasArriendoVivienda(cliente: Cliente): Promise<void> {
    await this.abrirModalConfirmarReferencias(cliente, TiposReferencias.ARRIENDO_VIVIENDA);
  }

  async confirmarReferenciasLaborales(cliente: Cliente): Promise<void> {
    await this.abrirModalConfirmarReferencias(cliente, TiposReferencias.LABORAL);
  }

  async revisarHistorial(cliente: Cliente, componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      await this.abrirModalHistorial(cliente);
    }
  }

  async revisarCreditosProspera(cliente: Cliente): Promise<void> {
    await this.abrirModalCreditosProspera(cliente);
  }

  async edicionCamposSolicitud(cliente: Cliente, nombre: string, valor: any, idCanalBuscado: any, canalesContacto: any, selected?: any,): Promise<void> {
    if (this.puedeEditarCampos && !this.canalesContacto(idCanalBuscado, canalesContacto)) {

      const valorActual = selected || valor.currentTarget.innerText;
      await this.abrirModalEdicionCamposSolicitud(cliente, nombre, valorActual);
    }
  }

  async cargosFijos(): Promise<void> {
    await this.abrirModalCargosFijos();
  }

  async edicionCamposDesembolso(cliente: Cliente, nombre: string, valor: any, selected?: any): Promise<void> {
    if (this.puedeEditarDesembolso) {

      const valorActual = selected || valor.currentTarget.innerText;
      await this.abrilModalEdicionCamposDesembolso(cliente, nombre, valorActual);
    }
  }

  async buscarCoincidencias(): Promise<void> {

    await this.abrirModalBuscarCoincidencias();
  }

  calcularEdad(fechaNacimiento: Date, fechaActual: Date): number {
    const diff = fechaActual.getTime() - fechaNacimiento.getTime();
    const edad = diff / (1000 * 60 * 60 * 24 * 365.25); // Años bisiestos
    return edad;
  }

  validarEdad(fechaNacimientoStr: string, fechaActualStr: string): boolean {
    const fechaNacimiento = new Date(fechaNacimientoStr);
    const fechaActual = new Date(fechaActualStr);

    const edad = this.calcularEdad(fechaNacimiento, fechaActual);
    return edad > 17.5;
  }

  async enviarAprobacion(componente: number, accion: number): Promise<void> {
    let esMayorDeEdad: boolean;
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const { miembros } = this.solicitud;

      esMayorDeEdad = miembros.some(element => {
        return !this.validarEdad(element.datosPersonalesCliente.fechaNacimiento, element.datosIdentificacionCliente.fechaExpedicion);
      });
      const aprobacionesConfirmadas = [];

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoLocal(m) ? true : !!m.aprobacion.referenciasArriendoLocal));

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoVivienda(m) ? true : !!m.aprobacion.referenciasArriendoVivienda));

      // si debe confirmar aprobacion de cliente experto y fue verificado
      aprobacionesConfirmadas.push(!this.esClienteExperto ? true : miembros.every(m => !!m.aprobacion.clienteExperto));

      // si esta confirmado aprobacion de fotos
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.fotos));

      // si esta confirmado aprobacion de firmas
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.firmas));

      if (((aprobacionesConfirmadas.every(a => a) || !!this.solicitud.renovacion) && !esMayorDeEdad)) {
        const { componentInstance: confirmacion, result } = this.modal.open(AlertComponent, { centered: true, size: 'lg' });

        confirmacion.title = 'Confirmación de envío a aprobación';
        confirmacion.description = `¿Realmente desea enviar esta solicitud a aprobación?`;
        confirmacion.buttons = AlertButtons.CONFIRM;

        const confirmar = await result;

        if (confirmar) {
          try {
            await this.modificarEstado(EstadoSolicitud.ValidacionGerente);
          } catch (e) {
            console.log(e);
          }
        }
      } else if (this.solicitud.estado > EstadoSolicitud.ValidacionAsistente && !esMayorDeEdad) {
        const { componentInstance: confirmacion, result } = this.modal.open(AlertComponent, { centered: true, size: 'lg' });

        confirmacion.title = 'Confirmación de envío a aprobación';
        confirmacion.description = `¿Realmente desea enviar esta solicitud a aprobación?`;
        confirmacion.buttons = AlertButtons.CONFIRM;

        const confirmar = await result;

        if (confirmar) {
          try {
            await this.modificarEstado(EstadoSolicitud.ValidacionGerente);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });
        info.title = 'Acción requerida';
        if (esMayorDeEdad) {
          info.description = 'Es necesario verificar la fecha de expedición y fecha de nacimiento, no cumple con la edad permitida.';
        } else {
          info.description = 'Es necesario las aprobaciones para poder avanzar la propuesta';
        }

        info.buttons = AlertButtons.INFO;
      }
    }
  }

  async enviarComite(componente: number, accion: number): Promise<void> {
    let esMayorDeEdad: boolean;
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const { miembros } = this.solicitud;
      esMayorDeEdad = miembros.some(element => {
        return !this.validarEdad(element.datosPersonalesCliente.fechaNacimiento, element.datosIdentificacionCliente.fechaExpedicion);
      });

      const aprobacionesConfirmadas = [];

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoLocal(m) ? true : !!m.aprobacion.referenciasArriendoLocal));

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoVivienda(m) ? true : !!m.aprobacion.referenciasArriendoVivienda));

      // si debe confirmar aprobacion de cliente experto y fue verificado
      aprobacionesConfirmadas.push(!this.esClienteExperto ? true : miembros.every(m => !!m.aprobacion.clienteExperto));

      // si esta confirmado aprobacion de fotos
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.fotos));

      // si esta confirmado aprobacion de firmas
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.firmas));
      const debeAprobarHistorial = this.solicitud.miembros.every(({ aprobacion }) => aprobacion.historial);

      let aprobarHistorial;

      this.esClienteExperto ? aprobarHistorial = true : aprobarHistorial = debeAprobarHistorial;


      if (aprobarHistorial && aprobacionesConfirmadas.every(a => a) && !esMayorDeEdad) {
        const { componentInstance: confirmacion, result } = this.modal.open(AlertComponent, { centered: true, size: 'lg' });
        confirmacion.title = 'Confirmación de envío a comité de decisión';
        confirmacion.description = `¿Realmente desea enviar esta solicitud a comité de decisión?`;
        confirmacion.buttons = AlertButtons.CONFIRM;

        const confirmar = await result;

        if (confirmar) {
          try {
            await this.modificarEstado(EstadoSolicitud.Comite);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

        info.title = 'Acción requerida';
        if (esMayorDeEdad) {
          info.description = 'Es necesario verificar la fecha de expedición y fecha de nacimiento, no cumple con la edad permitida.';
        } else {
          info.description = 'Es necesario evaluar historial de crédito y las aprobaciones para poder avanzar en la propuesta.';
        }
        info.buttons = AlertButtons.INFO;

      }
    }
  }

  async aprobar(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {

      const { miembros } = this.solicitud;
      const aprobacionesConfirmadas = [];

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoLocal(m) ? true : !!m.aprobacion.referenciasArriendoLocal));

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoVivienda(m) ? true : !!m.aprobacion.referenciasArriendoVivienda));

      // si debe confirmar aprobacion de cliente experto y fue verificado
      aprobacionesConfirmadas.push(!this.esClienteExperto ? true : miembros.every(m => !!m.aprobacion.clienteExperto));

      // si esta confirmado aprobacion de fotos
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.fotos));

      // si esta confirmado aprobacion de firmas
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.firmas));
      const identidadesValidadas = this.solicitud.miembros.every(m => [true, 'true'].includes(m.otp.validadoOtp));

      if (this.finDeSemanaPipe.transform()) {
        const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

        info.title = 'Acción bloqueada';
        info.description = 'No es posible enviar solicitudes a desembolso los días sábados y domingos.  Por favor, desembolsar el siguiente día hábil';
        info.buttons = AlertButtons.INFO;
      } else if (identidadesValidadas && aprobacionesConfirmadas.every(a => a)) {
        const { componentInstance: confirmacion, result } = this.modal.open(AlertComponent, { centered: true, size: 'lg' });
        confirmacion.title = 'Confirmación de envío a desembolso';
        confirmacion.description = `¿Realmente desea enviar esta solicitud a alta de clientes?`;
        confirmacion.buttons = AlertButtons.CONFIRM;

        const confirmar = await result;

        if (confirmar) {
          try {
            await this.modificarEstado(EstadoSolicitud.AltaClienteEnviado);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });
        info.title = 'Acción requerida';
        info.description = 'Es necesario validar la identidad de todos los miembros antes de enviar a alta de clientes y las aprobaciones para poder avanzar la propuesta.';
        info.buttons = AlertButtons.INFO;
      }
    }
  }

  async otp(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso && this.permitePasoValidarIdentidad) {
      const debeAprobarHistorial = this.solicitud.miembros.every(({ aprobacion }) => aprobacion.historial);
      const { miembros } = this.solicitud;
      const aprobacionesConfirmadas = [];

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoLocal(m) ? true : !!m.aprobacion.referenciasArriendoLocal));

      // si debe confirmar aprobacion de arriendo local de los miembros y fueron verificados
      aprobacionesConfirmadas.push(miembros
        .every(m => !this.verificaReferenciasArriendoVivienda(m) ? true : !!m.aprobacion.referenciasArriendoVivienda));

      // si debe confirmar aprobacion de cliente experto y fue verificado
      aprobacionesConfirmadas.push(!this.esClienteExperto ? true : miembros.every(m => !!m.aprobacion.clienteExperto));

      // si esta confirmado aprobacion de fotos
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.fotos));

      // si esta confirmado aprobacion de firmas
      aprobacionesConfirmadas.push(miembros.every(m => !!m.aprobacion.firmas));
      const identidadesValidadas = this.solicitud.miembros.every(m => [true, 'true'].includes(m.otp.validadoOtp));

      let aprobarHistorial;

      this.esClienteExperto ? aprobarHistorial = true : aprobarHistorial = debeAprobarHistorial;

      if (aprobarHistorial && aprobacionesConfirmadas.every(a => a)) {
        const result = this.modal.open(AlertComponent, { centered: true, size: 'lg' });
        result.componentInstance.title = 'Confirmación de envío a OTP';
        result.componentInstance.description = `¿Realmente desea enviar esta solicitud a OTP?`;
        result.componentInstance.buttons = AlertButtons.CONFIRM;

        const confirmar = await result.result;

        if (confirmar) {
          try {
            await this.modificarEstado(EstadoSolicitud.ValidacionIdentidad);
          } catch (e) {
            console.log(e);
          }
        }
      } else {
        const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

        info.title = 'Acción requerida';
        info.description = 'Es necesario evaluar historial de crédito y las aprobaciones para poder avanzar en la propuesta.';
        info.buttons = AlertButtons.INFO;
      }
    }
  }

  async devolver(componente, accion): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const result = this.modal.open(CausalDevolucionComponent, { centered: true });
      const motivoRechazoDevolucion = await result.result;

      if (motivoRechazoDevolucion) {
        try {
          await this.modificarEstado(EstadoSolicitud.Devuelta, { motivoRechazoDevolucion });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  async rechazar(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const result = this.modal.open(CausalRechazoDevolucionComponent, { centered: true });
      const motivoRechazoDevolucion = await result.result;

      if (!!motivoRechazoDevolucion) {
        try {
          await this.modificarEstado(EstadoSolicitud.Rechazada, { motivoRechazoDevolucion });
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  async descargarContrato(componente: number, accion: number): Promise<void> {
    this.permisosModulos(componente, accion);
    if (this.tienePermiso) {
      const { _id } = this.solicitud;

      try {
        const contrato: Blob = await this.api.solicitudes.contrato(_id);
        const url = URL.createObjectURL(contrato);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `contrato_${_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async modalDistanciamentoFotos(): Promise<void> {
    const { componentInstance } = await this.modal.open(DistanciaFotosModalComponent, {
      centered: true,
      windowClass: 'modal-edicion-distancia-fotos'
    });
    componentInstance.solicitud = this.solicitud;
  }

  permisoStep(): boolean {
    return this.session.hasSolicitudPermissions(this.solicitud);
  }

  findSeguro(seguro: { aprobado: boolean, asegurados: any }[]): any {
    return seguro.find(item => item.aprobado);
  }

  resultadoPreselecta(resultado: string) {
    var posicionGuion = resultado.indexOf('-');
    if (posicionGuion !== -1) {
      var textoExtraido = resultado.substring(0, posicionGuion);
    }
    return textoExtraido;
  }

  findSeguroAsegurados(asegurados: []): boolean {
    let mostrarAsegurados
    asegurados?.length > 0 ? mostrarAsegurados = true : mostrarAsegurados = false
    return mostrarAsegurados;
  }

  findSeguroBeneficiarios(beneficiarios: []): boolean {
    let mostrarBeneficiarios
    beneficiarios?.length > 0 ? mostrarBeneficiarios = true : mostrarBeneficiarios = false
    return mostrarBeneficiarios;
  }

  findSeguroMipyme(mypime: []): boolean {
    let mostrarMypime
    mypime?.length > 0 ? mostrarMypime = true : mostrarMypime = false
    return mostrarMypime;
  }

  aniosConstruccion(mipyme): any {
    const aniosConstruccion = mipyme.añosConstruccion;
    return aniosConstruccion;
  }


  verificaReferenciasArriendoLocal({ datosPersonalesCliente: { tipoDeLocal } }: Cliente): boolean {
    return tipoDeLocal.id === 3;
  }

  verificaReferenciasArriendoVivienda({ datosPersonalesCliente: { tipoDeVivienda } }: Cliente): boolean {
    return tipoDeVivienda.id === 3;
  }

  detalleMetodos(cliente: Cliente): void {
    const modalRef = this.modal.open(DetalleMetodosComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.montoVentas = cliente.encuestaSocioEconomica.montoVentas;
    modalRef.componentInstance.ciiu = cliente.datosComerciales.CIIUSubSector;
  }

  detalleMontos(cliente: Cliente): void {
    const modalRef = this.modal.open(DetalleMontosComponent, { centered: true });

    modalRef.componentInstance.historialMontos = cliente.solicitudEconomica.valoresDetalles.historialCambio;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  permisosModulos(componenteId: number, accion: number): any {
    const vista = this.permisos;
    const componente = vista.filter(m => m.id === PermisosComponentes.PROPUESTAS);
    const { modulos } = componente.find(m => m?.id === 1);
    const { acciones } = modulos.find(m => m?.id === componenteId);
    const permisoacciones = acciones.find(m => m?.id === accion);

    if (permisoacciones?.id !== accion) {
      this.tienePermiso = false;
      const { componentInstance: info } = this.modal.open(AlertComponent, { centered: true });

      info.title = 'Permiso';
      info.description = 'No tiene permisos';
      info.buttons = AlertButtons.INFO;
    } else {
      this.tienePermiso = true;
    }
  }

  // tslint:disable-next-line:max-line-length
  private async abrirModalRevisionDocs({ fotos, datosPersonalesCliente, declaracionFondos, datosIdentificacionCliente, tipoMiembro }: Cliente, modo: ModoModalAprobarImagen, fotosListaGeneral): Promise<void> {

    const keys = [
      'fotoCliente1',
      'fotoDocumentoAnverso',
      'fotoDocumentoReverso',
      'fotoClienteDocumentoMano',
      'fotoReciboPublico',
      'fotoMicroEmpresa1',
      'fotoMicroEmpresa2',
      'fotoReciboMicroEmpresa',
      'fotoComplementaria1',
      'fotoComplementaria2',
      'fotoOtrosIngresos',
      'firmaContrato',
      'firmaPagare',
      'firmaSeguro',
      'fotoCertificadoLaboral',
      'firmaGarantia',
      'fotoClienteMicroEmpresa',
      'fotoComplementaria3',
      'fotoComplementaria4',
      'fotoComplementaria5',
      'fotoExtractosBancarios',
      'fotoComplementaria6',
      'fotoComplementaria7'
    ];
    const fotosReducer = (map, key, s) => {
      const doc = s.fotos.find(f =>
        fotos[key] === f.id &&
        (modo === ModoModalAprobarImagen.Firmas ?
          key.toLowerCase().includes('firma') || key.toLowerCase().includes('documentoanverso') : !key.toLowerCase().includes('firma')));

      if (doc) {
        map[key] = doc;
      }

      return map;
    };





    const modalRef = this.modal.open(ValidarDocsModalComponent, {
      centered: true,
      size: modo === ModoModalAprobarImagen.Firmas ? 'xl' : 'lg'
    });
    modalRef.componentInstance.modo = modo;
    modalRef.componentInstance.declaracionFondos = declaracionFondos.texto;
    modalRef.componentInstance.tipoSolicitud = this.solicitud.tipoSolicitud.id;
    modalRef.componentInstance.estadoSolicitud = this.solicitud.estado;
    modalRef.componentInstance.documentoChange.subscribe(async nombre => {

      if (!modalRef.componentInstance.imagenes$.some(item => item.nombre === nombre)) {
        // this.fotosObligatorias(fotosListaGeneral, tipoMiembro)
        try {
          this.spinner.show();
          const validarEncabezado = 1;
          modalRef.componentInstance.validarEncabezado = validarEncabezado
          const { _id } = this.solicitud;
          const img = await this.api.solicitudes.obtenerAdjuntoServerEstatico({ _id, nombre });
          const imgBase64 = await blobToBase64(img);
          modalRef.componentInstance.imagenes$.push({ nombre, base64: imgBase64 });
          this.spinner.hide();
          console.log(img)
        } catch (e) {
          console.log(e);
        }
      }
    });
    modalRef.componentInstance.aprobacionChange.subscribe(async value => {
      const { _id, idSolicitud } = this.solicitud;

      // lanzar modal rechazo, antes de realizar peticion
      if (value.estado === 2) {
        const { componentInstance, result } = this.modal.open(RechazarDocsModalComponent, { centered: true, windowClass: 'modal-rechazo' });
        const img = modalRef.componentInstance.imagenes$.find(item => item.nombre === value.nombre);

        const tipoImagen = value.encabezado === 1 ? this.imagenServerEstatico(img) : this.imagenBaseDatos(img);

        componentInstance.img = tipoImagen;
        componentInstance.miembro = datosPersonalesCliente;
        componentInstance.idSolicitud = idSolicitud;
        value = { ...value, ...(await result) };
      }

      // realizar peticion
      try {
        delete value.nombre; // util para buscar el base64, pero no se recibe en el request.
        delete value.titulo; // util para mostrar en modal, pero no se recibe en el request.
        delete value.encabezado;
        const { numeroIdentificacion } = datosIdentificacionCliente
        await this.api.solicitudes.modificarImagen({ ...{ _id, numeroIdentificacion }, ...value });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        modalRef.componentInstance.documentos.next(keys.reduce((map, k) => fotosReducer(map, k, data[0]), {}));
        this.solicitud = data[0];
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    });

    // documentos registrados para el cliente, según el objeto fotos
    // estos se filtran según el id registrado para cada key del objeto fotos y entonces se muestran en el componente
    modalRef.componentInstance.documentos.next(keys.reduce((map, k) => fotosReducer(map, k, this.solicitud), {}));
    console.log(modalRef.componentInstance.imagenes$);
    console.log(modalRef.componentInstance.imagenesObligatorias$)
  }

  // tslint:disable-next-line:max-line-length
  private async abrirModalRevisionDocsSeguros({ fotos, seguro, datosPersonalesCliente, declaracionFondos, datosIdentificacionCliente }: any, modo: ModoModalAprobarImagen, fotosGenerales): Promise<void> {
    const keys = [
      'fotoDocumentoAnverso'
    ];
    const fotosReducer = (map, key, s) => {
      const doc = s.fotos.find(f =>
        fotos[key] === f.id &&
        (modo === ModoModalAprobarImagen.Firmas ?
          key.toLowerCase().includes('firma') || key.toLowerCase().includes('documentoanverso') : !key.toLowerCase().includes('firma')));

      if (doc) {
        map[key] = doc;
      }

      return map;
    };
    // Filtrar coincidencias iniciales
    let coincidencias = fotosGenerales.filter((foto) => {
      return seguro.some((seguroItem) => {
        return seguroItem.firma && seguroItem.firma.firmaId === foto.id;
      });
    });

    // Filtrar y agregar los objetos que cumplen con la condición segurosBO pero que no están ya en coincidencias
    const adicionalesBO = seguro
      .filter((seguroItem) => {
        const segurosBO = seguroItem.usuarioRegistra?.idRol === 2 && seguroItem?.otp?.validado === true;

        // Filtrar los que cumplen la condición segurosBO y que no están ya en coincidencias
        return segurosBO && !coincidencias.some((c) => c.id === seguroItem.firma?.firmaId);
      })
      .map((seguroItem) => {
        // Agregar la propiedad aprobado: 1
        return { ...seguroItem, aprobada: 1, Nombreid: seguroItem.pdfId, id: seguroItem.pdfId };
      });


    // Combinar los resultados
    coincidencias = [...coincidencias, ...adicionalesBO];


    // Filtrar coincidencias que no cumplen con la condición
    const coincidenciasFiltradas = (coincidencias as any[]).filter((item: any) =>
      !(item.usuarioRegistra?.idRol === 2 && item?.otp?.validado === true)
    );

    // Reducir la lista filtrada en objetoSeguros
    const objetoSeguros = coincidenciasFiltradas.reduce<{ [key: string]: any }>((p, c) => {
      p[c.id] = c;
      return p;
    }, {});

    // Filtrar coincidencias que  cumplen con la condición
    const coincidenciasFiltradasBO = (coincidencias as any[]).filter((item: any) =>
      (item.usuarioRegistra?.idRol === 2 && item?.otp?.validado === true)
    );
    const objetoSegurosBO = (coincidenciasFiltradasBO as any[]).reduce<{ [key: string]: any }>((p, c) => {
      p[c.pdfId] = c;
      return p;
    }, {});

    const objetoUnificado = {
      ...objetoSeguros,
      ...objetoSegurosBO,
    };
    const fotoDocumento = keys.reduce((map, k) => fotosReducer(map, k, this.solicitud), {});

    // Combina fotos y objetoSeguros en un solo objeto
    const resultado = { ...fotoDocumento, ...objetoUnificado };

    console.log(resultado);

    const modalRef = this.modal.open(ValidarSegurosModalComponent, {
      centered: true,
      size: modo === ModoModalAprobarImagen.Firmas ? 'xl' : 'lg'
    });
    modalRef.componentInstance.modo = modo;
    modalRef.componentInstance.declaracionFondos = declaracionFondos.texto;
    modalRef.componentInstance.tipoSolicitud = this.solicitud.tipoSolicitud.id;
    modalRef.componentInstance.estadoSolicitud = this.solicitud.estado;
    modalRef.componentInstance.cliente = datosPersonalesCliente;

    // registro de eventos emitidos desde el modal, estos son gestionados desde este controlador
    // porque es quien tiene toda la data, services y otros.
    modalRef.componentInstance.documentoChange.subscribe(async nombre => {
      if (!modalRef.componentInstance.imagenes$.some(item => item.nombre === nombre)) {
        try {
          this.spinner.show();
          const validarEncabezado = 1;
          modalRef.componentInstance.validarEncabezado = validarEncabezado
          const { _id } = this.solicitud;
          const img = await this.api.solicitudes.obtenerAdjuntoServerEstatico({ _id, nombre });
          const imgBase64 = await blobToBase64(img);
          modalRef.componentInstance.imagenes$.push({ nombre, base64: imgBase64 });
          this.spinner.hide();
          console.log(img)
        } catch (e) {
          console.log(e);
        }
      }
    });
    modalRef.componentInstance.aprobacionChange.subscribe(async value => {
      const { _id, idSolicitud } = this.solicitud;

      // lanzar modal rechazo, antes de realizar peticion
      if (value.estado === 2) {
        const { componentInstance, result } = this.modal.open(RechazarDocsModalComponent, { centered: true, windowClass: 'modal-rechazo' });
        const img = modalRef.componentInstance.imagenes$.find(item => item.nombre === value.nombre);

        const tipoImagen = value.encabezado === 1 ? this.imagenServerEstatico(img) : this.imagenBaseDatos(img);

        componentInstance.img = tipoImagen;
        componentInstance.miembro = datosPersonalesCliente;
        componentInstance.idSolicitud = idSolicitud;
        value = { ...value, ...(await result) };
      }

      // realizar peticion
      try {
        delete value.nombre; // util para buscar el base64, pero no se recibe en el request.
        delete value.titulo; // util para mostrar en modal, pero no se recibe en el request.
        delete value.encabezado;
        const { numeroIdentificacion } = datosIdentificacionCliente
        await this.api.solicitudes.modificarImagen({ ...{ _id, numeroIdentificacion }, ...value });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        const coincidenciasRefrescar = data[0].fotos.filter((foto) => {
          return seguro.some((seguroItem) => {
            return seguroItem.firma && seguroItem.firma.firmaId === foto.id;
          });
        });

        const objetoSegurosRefrescar = (coincidenciasRefrescar as any[]).reduce<{ [key: string]: any }>((p, c) => {
          p[c.id] = c;
          return p;
        }, {});


        const fotoDocumento = keys.reduce((map, k) => fotosReducer(map, k, this.solicitud), {});

        // Combina fotos y objetoSeguros en un solo objeto
        const resultadoRefrescar = { ...fotoDocumento, ...objetoSegurosRefrescar };
        console.log(resultado);
        modalRef.componentInstance.documentosSeguros.next(resultadoRefrescar);
        this.solicitud = data[0];
        this.updateSolicitud(data[0]);
      } catch (e) {
        console.log(e);
      }
    });
    // documentos registrados para el cliente, según el objeto fotos
    // estos se filtran según el id registrado para cada key del objeto fotos y entonces se muestran en el componente
    modalRef.componentInstance.documentosSeguros.next(resultado);
  }

  crearObjetoFotosRechazadas(elementMiembro) {
    this.mostrarDatosFotos.push({
      aprobada: elementMiembro.aprobada,
      keyFoto: elementMiembro.keyNombre,
    });
  }
  crearObjetoFirmasRechazadas(elementMiembro) {
    this.mostrarDatosFirmas.push({
      aprobada: elementMiembro.aprobada,
      keyFoto: elementMiembro.keyNombre,
    });
  }

  fotosObligatorias(fotosListaGeneral, tipoMiembro, tipoSolicitud, fotosMiembro) {
    // Crear un conjunto para almacenar los mensajes
    const mensajes = new Set();

    const coincidencias = [];

    // Obtener la lista de fotos obligatorias del almacenamiento local
    const listadoFotosObligatorias = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG));
    const fotosObligatorias = listadoFotosObligatorias.fotos;

    for (const [keyFoto, idFoto] of Object.entries(fotosMiembro)) {
      if (fotosListaGeneral.length !== 0) {
        for (const elementMiembro of fotosListaGeneral) {
          if (elementMiembro.Nombreid === idFoto && elementMiembro.keyNombre === keyFoto) {
            coincidencias.push({ key: keyFoto, id: idFoto });
          }
        }
      };
    }


    fotosObligatorias.forEach(seccion => {
      // Iterar sobre las fotos dentro de cada sección
      seccion.fotos.forEach(fotoObj => {
        const fotoNombre = Object.keys(fotoObj)[0];
        const fotoTipoMiembro = fotoObj[fotoNombre].tipoMiembro;
        const fotoLabel = fotoObj[fotoNombre].label;
        const fotoPlus = fotoObj[fotoNombre].plus;
        if ((tipoSolicitud.id === TipoSolicitud.INDIVIDUAL || tipoSolicitud.id === TipoSolicitud.INDIVIDUAL_CON_GARANTIA) &&
          tipoSolicitud.plus === true) {
          // Verificar si el tipo de miembro está permitido para la foto
          if (fotoTipoMiembro.includes(tipoMiembro.id) && fotoPlus === "true") {
            // Verificar si la foto obligatoria está presente en la lista de fotos disponibles
            const fotoEncontrada = coincidencias.find(foto => foto.key === fotoNombre);

            // Si la foto no se encuentra, agregar el mensaje al conjunto
            if (!fotoEncontrada) {
              mensajes.add(`La foto ${fotoLabel} es obligatoria pero no se ha encontrado.`);
            }
          }

        }
        // Verificar si el tipo de miembro está permitido para la foto
        else if (fotoTipoMiembro.includes(tipoMiembro.id) && tipoSolicitud.plus === undefined) {
          // Verificar si la foto obligatoria está presente en la lista de fotos disponibles
          const fotoEncontrada = coincidencias.find(foto => foto.key === fotoNombre);

          // Si la foto no se encuentra, agregar el mensaje al conjunto
          if (!fotoEncontrada) {
            mensajes.add(`La foto ${fotoLabel} es obligatoria pero no se ha encontrado.`);
          }
        }
      });
    });

    // Convertir el conjunto a un array y devolverlo
    return Array.from(mensajes);
  }

  imagenServerEstatico(img: any): string {
    //  const url = img ? img.base64 : ''
    // return this.sanitizer.bypassSecurityTrustUrl(url);
    return img ? img.base64 : '';
  }

  imagenBaseDatos(img: any): string {
    // const url = img ? `data:image/jpg;base64,${img.base64}` : '';
    // return this.sanitizer.bypassSecurityTrustUrl(url);
    return img ? img.base64 : '';
  }

  private async abrirModalConfirmarReferencias(cliente: Cliente, grupo: TiposReferencias): Promise<void> {
    const { data: referencias } = await this.api.referencias.buscar(grupo);
    const { componentInstance, result } = this.modal.open(ConfirmarRefComponent, { centered: true, size: 'lg' });
    const preguntasKey = grupo === TiposReferencias.ARRIENDO_LOCAL ? 'preguntasArriendoLocal' :
      grupo === TiposReferencias.ARRIENDO_VIVIENDA ? 'preguntasArriendoVivienda' : 'preguntasReferenciasLaborales';

    cliente[preguntasKey]?.forEach(p => {
      const referencia = referencias.find(r => r._id === p._id);
      referencia.respuestaCliente = referencia ? p.respuestaCliente :
        '';
    });

    if (preguntasKey === 'preguntasArriendoLocal') {
      componentInstance.clienteNombre = cliente.referenciasCliente?.nombreArrendadorLocal;
      componentInstance.clienteTelefono = cliente.referenciasCliente?.telefonoArrendadorLocal;
    } else if (preguntasKey === 'preguntasArriendoVivienda') {
      componentInstance.clienteNombre = cliente.referenciasCliente?.nombreArrendador;
      componentInstance.clienteTelefono = cliente.referenciasCliente?.telefonoArrendador;
    } else {
      componentInstance.clienteNombre = cliente.datosCoodeudorAsalariado?.informacionLaboral?.nombreEmpresa;
      componentInstance.clienteTelefono = cliente.datosCoodeudorAsalariado?.informacionLaboral?.telefono;
    }
    componentInstance.referencias = referencias;
    componentInstance.cliente = cliente;
    try {
      const { preguntas } = await result;
      const { _id } = this.solicitud;
      const { datosIdentificacionCliente: { numeroIdentificacion } } = cliente;
      await this.api.solicitudes.registrarReferencias({ _id, identificacion: numeroIdentificacion, preguntas, grupo });
      const { data } = await this.api.solicitudes.buscarPorId({ _id });
      this.solicitud = data[0];
    } catch (e) {
      console.log(e);
    }

  }


  private async abrirModalPreguntasSeguridadOtp(cliente: Cliente, idSolicitud: string): Promise<void> {
    const { data } = await this.api.preguntas.obtenerPreguntasOtp({ idSolicitud: idSolicitud, documento: cliente.datosIdentificacionCliente.numeroIdentificacion });
    console.log(data)
    const { componentInstance } = this.modal.open(GenerarPreguntasComponent, { centered: true, size: 'lg' });

    componentInstance.data = data;

    try {
      const respuestas = await new Promise<any[]>((resolve, reject) => {
        componentInstance.respuestasEnviadas.subscribe({
          next: (respuestas: any[]) => {
            resolve(respuestas);
          },
          error: (error: any) => {
            reject(error);
          }
        });
      });

      const { _id } = this.solicitud;
      const { datosIdentificacionCliente: { numeroIdentificacion } } = cliente;
      await this.api.preguntas.validarPreguntasOtp({ idSolicitud: _id, documento: numeroIdentificacion, respuestas: respuestas });
      setTimeout(async () => {
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        this.solicitud = data[0];
        this.updateSolicitud(data[0]);
      }, 2500); // Retraso de 3 segundos
    } catch (e) {
      console.log(e);
    }

  }
  private async abrirModalHistorial(cliente: Cliente): Promise<void> {
    const {
      datosIdentificacionCliente: {
        numeroIdentificacion: identificacion,
        tipoIdentificacion: { id: tipoIdentificacion }
      },
      datosPersonalesCliente: { apellido1: primerApellido }
    } = cliente;

    try {
      const { data } = await this.api.solicitudes.historialCredito({ tipoIdentificacion, identificacion, primerApellido });
      const { componentInstance } = this.modal.open(HistorialComponent, { centered: true, size: 'xl' });

      componentInstance.historial = data;
    } catch (e) {
      console.log(e);
    }

  }

  private async abrirModalCreditosProspera(cliente: Cliente): Promise<void> {
    const { datosIdentificacionCliente: { numeroIdentificacion } } = cliente;

    try {
      const { data } = await this.api.solicitudes.buscarPorCedula({ numeroIdentificacion: +numeroIdentificacion });
      const { componentInstance } = this.modal.open(CreditosClienteComponent, { centered: true, size: 'lg' });

      componentInstance.solicitudes = data;
      componentInstance.cliente = cliente;
    } catch (e) {
      console.log(e);
    }

  }

  async abrirModalEdicionCamposSolicitud(cliente: Cliente, nombre: string, valorActual: any): Promise<void> {
    const editable = CamposEditables[nombre]?.editable(cliente, this.solicitud);
    if (editable) {
      const { _id } = this.solicitud;
      const { datosIdentificacionCliente: { numeroIdentificacion } } = cliente;
      const ruta = CamposEditables[nombre]?.ruta;
      const { componentInstance } = await this.modal.open(EdicionCamposModalComponent, {
        centered: true,
        windowClass: 'modal-edicion-campos-solicitud'
      });
      componentInstance.cliente = cliente;
      componentInstance.propiedades = CamposEditables[nombre];
      componentInstance.valorActual = valorActual;
      componentInstance.camposEdicion.subscribe(async value => {
        try {
          await this.api.solicitudes.edicionCamposSolicitud({
            _id, identificacion: numeroIdentificacion,
            campo: ruta, ...value
          });
          const { data } = await this.api.solicitudes.buscarPorId({ _id });
          this.solicitud = data[0];
        } catch (e) {
          if (!environment.production) {
            console.log(e);
          }
        }
      });
    }
  }

  async abrirModalCargosFijos(): Promise<void> {
    const { componentInstance } = await this.modal.open(CargosFijosComponent, {
      centered: true,
      size: 'lg'
    });

    componentInstance.resultadoSimulador = this.resultadoSimulador;
    componentInstance.solicitud = this.solicitud
    componentInstance.soat = this.clienteSoat();
    this.recargarInformacion();
  }

  async abrirModalVentaSeguros(cliente: Cliente): Promise<void> {
    const { _id } = this.solicitud;

    // Abre el modal de VentaSegurosComponent
    const modalRef = this.modal.open(VentaSegurosComponent, {
      centered: true,
      windowClass: 'modal-venta-seguros',
      backdrop: 'static',  // Impide cerrar el modal al hacer clic fuera
      keyboard: false
    });

    // Asigna los datos al componente del modal
    const componentInstance = modalRef.componentInstance;
    componentInstance.idSolicitud = _id;
    componentInstance.documento = cliente.datosIdentificacionCliente.numeroIdentificacion;
    componentInstance.telefono = cliente.datosContactoCliente.telefono;
    componentInstance.fechaNacimiento = cliente.datosPersonalesCliente.fechaNacimiento
    componentInstance.CodigoCIIU = cliente?.datosComerciales?.CIIUSubSector?.actividad
    componentInstance.marcaSOAT = this.clienteSoat();

    try {
      // Espera a que el modal se cierre (normalmente con close)
      const result = await modalRef.result;
      console.log(`Modal cerrado con: ${result}`);
    } catch (dismissReason) {
      // Manejo de modal cerrado con dismiss (ej. al hacer clic en "X")
      console.log(`Modal dismiss con razón: ${dismissReason}`);
    }

    // Llama a recargar información y validación sin importar cómo se cerró el modal
    await this.recargarInformacion();
    await this.validarYEliminarSeguros(cliente, _id);
  }

  async abrirModalBuscarCoincidencias(): Promise<void> {
    const miembros = this.solicitud.miembros || [];
    const data = {
      idSolicitud: this.solicitud.idSolicitud,

      cedulas: miembros
        .map(
          miembro =>
            miembro?.datosIdentificacionCliente?.numeroIdentificacion
        )
        .filter(
          valor =>
            valor !== null && valor !== undefined && valor !== ''
        ),

      telefonos: miembros.reduce(
        (telefonos: any[], miembro: any) => {
          const telefono =
            miembro?.datosContactoCliente?.telefono;

          const telefono1 =
            miembro?.datosContactoCliente?.telefono1;

          if (telefono !== null && telefono !== undefined && telefono !== '') {
            telefonos.push(telefono);
          }

          if (telefono1 !== null && telefono1 !== undefined && telefono1 !== '') {
            telefonos.push(telefono1);
          }

          return telefonos;
        },
        []
      ),

      direcciones: miembros
        .map(
          miembro =>
            miembro?.datosContactoCliente?.direccion?.trim()
        )
        .filter(
          valor =>
            valor !== null && valor !== undefined && valor !== ''
        )
    };

    try {
      const resp: any =
        await this.api.solicitudes.buscarCoincidencias(data);
      if (resp.data?.length) {
        const modal = this.modal.open(BuscarCoincidenciasModalComponent,
          {
            centered: true,
            size: 'lg'
          }
        );

        modal.componentInstance.coincidencias =
          resp?.data || [];
      }
    } catch (err) {
    }
  }

  async validarDesembolsoEnCurso(): Promise<void> {
    if (this.solicitud.estado === EstadoSolicitud.ValidacionAsistente ||
      this.solicitud.estado === EstadoSolicitud.ValidacionIdentidad
      ) {
      const params = {
        idSolicitud: this.solicitud.idSolicitud,
        cedula:
          this.solicitud.miembros[0]
            .datosIdentificacionCliente
            .numeroIdentificacion,
        fecha: new Date()
      };

      try {
        const resp =
          await this.api.solicitudes
            .buscarDesembolsosEnCurso(params);

        if (
          resp?.data?.alerta &&
          resp.data.desembolsos?.length
        ) {
          const mensaje = resp.data.desembolsos
            .map((d) => {
              const periodo = {
                DIA: 'el mismo día',
                SEMANA: 'la misma semana',
                MES: 'el mismo mes'
              }[d.periodoCoincidente] || 'el mismo periodo';

              const fecha = new Date(d.createdAt)
                .toLocaleDateString('es-CO');

              return `
                <div style="
                  margin-bottom: 18px;
                  font-size: 17px;
                  line-height: 1.7;
                ">
                  • Durante ${periodo},
                  con la solicitud
                  <strong>${d.idSolicitud}</strong>,
                  registrada el <strong>${fecha}</strong>.
                </div>
              `;
            })
            .join('');

          const descripcion = `
            <div style="
              font-size: 17px;
              line-height: 1.8;
            ">
              Este cliente tiene los siguientes desembolsos en curso:
              <br><br>
              ${mensaje}
            </div>
          `;

          this.mostrarAlertaDesembolso(descripcion);
        }
      } catch (error) {
        console.error(
          'Error al consultar desembolsos en curso:',
          error
        );
      } 
    }

  }

  private mostrarAlertaDesembolso(mensaje: string): void {
    const result = this.modal.open(AlertComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'modal-desembolso'
    });

    result.componentInstance.title = 'Desembolsos en curso encontrados';
    result.componentInstance.description = mensaje;
    result.componentInstance.level = AlertLevel.WARNING_LEVEL;
    result.componentInstance.buttons = AlertButtons.INFO;
  }


  async recargarInformacion() {
    try {
      const { _id } = this.solicitud;
      const { data } = await this.api.solicitudes.buscarPorId({ _id });

      this.solicitud = data[0];
      this.updateSolicitud(data[0]);
      this.appRef.tick();

    } catch (error) {
      console.error('Error al recargar la información', error);
    }
  }

  async validarYEliminarSeguros(cliente: Cliente, _id: string) {
    try {
      // Asegúrate de que la solicitud y los miembros estén disponibles
      if (!this.solicitud || !this.solicitud.miembros) {
        console.warn('No hay solicitud o miembros disponibles para procesar.');
        return;
      }

      // Verificar y borrar si es necesario
      for (const miembro of this.solicitud.miembros) {
        if (miembro.seguro && Array.isArray(miembro.seguro)) {
          for (const seguroItem of miembro.seguro) {
            if (seguroItem.otp?.validado === false) {
              await this.borrarSeguro(seguroItem.cf, cliente, _id);
              console.log(`Borrado el seguro con cf: ${seguroItem.cf}`);
            }
          }
        }
      }

    } catch (error) {
      console.error('Error al validar y eliminar los seguros', error);
    }
  }

  async borrarSeguro(cf: any, cliente: Cliente, id) {
    try {
      const element = {
        idSolicitud: id,
        documento: cliente.datosIdentificacionCliente.numeroIdentificacion,
        cf: cf
      };

      // Espera a que se complete la eliminación
      const response = await this.api.solicitudes.eliminarSeguro(element);
      console.log('Seguro borrado correctamente', response);

      // Recarga la información después de que la eliminación haya sido exitosa
      await this.recargarInformacion();
    } catch (error) {
      console.error('Error al borrar el seguro', error);
    }
  }

  async abrilModalEdicionCamposDesembolso(cliente: Cliente, nombre: string, valorActual: any): Promise<void> {
    const { _id } = this.solicitud;
    const { datosIdentificacionCliente: { numeroIdentificacion } } = cliente;
    const { datosIdentificacionCliente: { tipoIdentificacion } } = cliente;
    // const ruta = CamposEditables[nombre]?.ruta;
    const { componentInstance } = await this.modal.open(EdicionDesembolsoComponent, {
      centered: true,
      size: 'lg'
    });
    componentInstance.cliente = cliente;

    componentInstance.desembolso = cliente.desembolso
    componentInstance.propiedades = CamposEditables[nombre];
    componentInstance.valorActual = valorActual;
    componentInstance.camposEdicion.subscribe(async value => {
      try {
        const resetResponse = await this.api.dispersiones.resetearDispersiones({
          documento: Number(numeroIdentificacion),
          tipoDocumento: tipoIdentificacion.id,
          descripcion: value.motivo
        })
        if (resetResponse.status === 200) {
          if (value.tipoTransferencia.id === 1) {
            const data1 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.tipoDesembolso', motivo: value.motivo, valor: value.tipoTransferencia };
            const data2 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.numeroCuenta', motivo: value.motivo, valor: numeroIdentificacion };

            await this.api.solicitudes.edicionCamposSolicitud(data1);
            await this.api.solicitudes.edicionCamposSolicitud(data2);
            const { data } = await this.api.solicitudes.buscarPorId({ _id });
            this.solicitud = data[0];

          } else {
            const data1 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.banco', motivo: value.motivo, valor: value.banco };
            const data2 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.tipoCuenta', motivo: value.motivo, valor: value.tipoCuenta };
            const data3 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.numeroCuenta', motivo: value.motivo, valor: value.numeroCuenta };
            const data4 = { _id, identificacion: numeroIdentificacion, campo: 'desembolso.tipoDesembolso', motivo: value.motivo, valor: value.tipoTransferencia };
            // Llama al servicio cuatro veces con diferentes datos
            try {
              await this.api.solicitudes.edicionCamposSolicitud(data1);
              await this.api.solicitudes.edicionCamposSolicitud(data2);
              await this.api.solicitudes.edicionCamposSolicitud(data3);
              await this.api.solicitudes.edicionCamposSolicitud(data4);
              console.log("Los servicios se han enviado con éxito.");
              const { data } = await this.api.solicitudes.buscarPorId({ _id });
              this.solicitud = data[0];
            } catch (error) {
              console.error("Ocurrió un error al enviar los servicios:", error);
            }
          }
        }
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    });
  }


  private async abrirModalOTP(cliente: Cliente): Promise<void> {
    const clienteParaOTP = { ...cliente };
    const { _id } = this.solicitud;
    const { datosIdentificacionCliente: { numeroIdentificacion: identificacion } } = clienteParaOTP;

    const findClientePredicate = m =>
      m.datosIdentificacionCliente.numeroIdentificacion === clienteParaOTP.datosIdentificacionCliente.numeroIdentificacion;
    const findOtrosClientesPredicate = m =>
      m.datosIdentificacionCliente.numeroIdentificacion !== clienteParaOTP.datosIdentificacionCliente.numeroIdentificacion;

    const { componentInstance } = this.modal.open(ValidarOtpComponent, { centered: true, size: 'lg' });

    const tipoGarantia = TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.solicitud.tipoSolicitud.id ? 'Es usted consciente que su crédito tiene garantía con el fondo de garantía, que tiene un costo, y este costo se encuentra incluido dentro de su crédito.' :
      null;
    if (this.esGarantia && TipoSolicitud.INDIVIDUAL_CON_GARANTIA === this.solicitud.tipoSolicitud.id) {
      componentInstance.guion =
        `<span class="py-1">Señor(a) ${nombreCompletoMiembro(cliente)}</span>
       <span class="py-2">${tipoGarantia}</span>`;
    } else if (this.esGrupal && TipoSolicitud.INDIVIDUAL_CON_GARANTIA !== this.solicitud.tipoSolicitud.id) {
      componentInstance.guion = `<span class="py-1">Señor(a) ${nombreCompletoMiembro(cliente)}</span>
      <span class="py-1">¿Conoce usted a los señores ${this.solicitud.miembros.filter(findOtrosClientesPredicate).map(m => nombreCompletoMiembro(m)).join(', ')}? (Respuesta del cliente).</span>
      <span class="py-1">¿Está usted dispuesto, a que en caso que alguno de ellos no pague su parte de la obligación,  a asumir el pago de la misma y ayudar en la recuperación?.</span>`;
    } else {
      null;
    }



    componentInstance.iniciarValidacion.subscribe(async _ => {

      try {
        await this.api.solicitudes.iniciarOTP({ _id, identificacion, fechaEquipo: moment().toISOString() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        componentInstance.otpManager.next(data[0].miembros.find(findClientePredicate));
        this.solicitud = data[0];
      } catch (e) {
        console.log(e);
      }

    });
    componentInstance.generarCodigoOTP.subscribe(async _ => {

      try {
        await this.api.solicitudes.generarCodigoOTP({ _id, identificacion, fechaEquipo: moment().toISOString() });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        componentInstance.otpManager.next(data[0].miembros.find(findClientePredicate));
        this.solicitud = data[0];
      } catch (e) {
        console.log(e);
      }

    });
    componentInstance.confirmarCodigoOTP.subscribe(async value => {
      try {
        await this.api.solicitudes.confirmarOTP({ _id, ...value });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        componentInstance.otpManager.next(data[0].miembros.find(findClientePredicate));
        this.solicitud = data[0];
      } catch (e) {
        console.log(e);
      }
    });
    componentInstance.obtenerPreguntas.subscribe(async _ => {
      try {
        await this.api.solicitudes.obtenerPreguntasOTP({ _id, identificacion });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        componentInstance.otpManager.next(data[0].miembros?.find(findClientePredicate));
        this.solicitud = data[0];
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    });
    componentInstance.validarPreguntas.subscribe(async respuestas => {
      try {
        await this.api.solicitudes.validarPreguntasOTP({ _id, identificacion, respuestas });
        const { data } = await this.api.solicitudes.buscarPorId({ _id });
        componentInstance.otpManager.next(data[0].miembros.find(findClientePredicate));
        this.solicitud = data[0];
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    });

    componentInstance.otpManager.next(cliente);
  }

  private async modificarEstado(estado: number, extras?: any): Promise<void> {
    const { _id } = this.solicitud;

    try {
      await this.api.solicitudes.modificarEstado({ _id, estado, ...extras });
      const { data } = await this.api.solicitudes.buscarPorId({ _id });
      this.solicitud = data[0];
      this.updateSolicitud(data[0]);
    } catch (e) {
      console.log(e);
    }
  }

  private prepararSimulador(): void {
    try {
      this.clientesContrato = simulador.clientesContrato.bind(simulador);
      this.sumCuotas = simulador.sumCuotas.bind(simulador);
      this.cuotaMax = simulador.cuotaMax.bind(simulador);
      this.cuotaMaxCodeudorAsalariado = simulador.cuotaMaxCodeudorAsalariado.bind(simulador);
      this.lider = simulador.lider.bind(simulador);
      this.cuotaGrupal = simulador.cuotaGrupal.bind(simulador);
      this.simuladorMotor = simulador.simuladorMotor.bind(simulador)
    } catch (e) {
      console.log(e);
    }
  }

  private updateSolicitud(solicitud: Solicitudes): void {
    if (solicitud) {
      const aprobacionFormReducer = (m: { [key: string]: AprobacionesForm }, o: Cliente) => {
        const { datosIdentificacionCliente: { numeroIdentificacion } } = o;

        !m[numeroIdentificacion] ?
          m[numeroIdentificacion] = new AprobacionesForm(o, solicitud) :
          m[numeroIdentificacion].reset(o);

        return m;
      };
      const forzarOTPFormReducer = (m: { [key: string]: ForzarOTPForm }, o: Cliente) => {
        const { datosIdentificacionCliente: { numeroIdentificacion } } = o;

        !m[numeroIdentificacion] ?
          m[numeroIdentificacion] = new ForzarOTPForm(o) :
          m[numeroIdentificacion].reset(o);

        return m;
      };

      const historialAprobarFormReducer = (m: { [key: string]: AprobacionesHistorialForm }, o: Cliente) => {
        const { datosIdentificacionCliente: { numeroIdentificacion } } = o;

        !m[numeroIdentificacion] ?
          m[numeroIdentificacion] = new AprobacionesHistorialForm(o, solicitud) :
          m[numeroIdentificacion].reset(o);

        return m;
      }

      this.aprobacionesForm = solicitud.miembros
        .reduce(aprobacionFormReducer, this.aprobacionesForm || {} as { [key: string]: AprobacionesForm });

      this.forzarOTPForm = solicitud.miembros
        .reduce(forzarOTPFormReducer, this.forzarOTPForm || {} as { [key: string]: ForzarOTPForm });

      this.aprobacionesHistorialForm = solicitud.miembros
        .reduce(historialAprobarFormReducer, this.aprobacionesHistorialForm || {} as { [key: string]: AprobacionesHistorialForm });


      this.solicitud = solicitud;
      if (this.solicitud.simulacion === undefined &&
        this.solicitud.estado !== EstadoSolicitud.AprobadaDesembolsada) {
        const { error: errorSimulacion, simulacion } = this.cuotaGrupal(solicitud, moment().toISOString(false));
        this.resultadoSimulador = (!errorSimulacion && simulacion) || new Error(`E-SIM: simulador ha fallado.  ${errorSimulacion}`);
        if (this.solicitud.motor && this.solicitud.renovacion) {
          const { error: errorSimulacion, simulacion } = this.cuotaGrupal(solicitud, moment().toISOString(false));
          this.resultadoSimulador = (!errorSimulacion && simulacion) || new Error(`E-SIM: simulador ha fallado.  ${errorSimulacion}`);
        } else if (this.solicitud.motor) {
          const { error: errorSimulacion, simulacion } = this.simuladorMotor(solicitud, moment().toISOString(false));
          this.resultadoSimulador = (!errorSimulacion && simulacion) || new Error(`E-SIM: simulador ha fallado.  ${errorSimulacion}`);
          console.log(this.resultadoSimulador)
        }
      } else {
        this.resultadoSimulador = this.solicitud.simulacion.simulacion;
        console.log(this.resultadoSimulador)
      }

      const apruebaComoGrte = this.solicitud.miembros.every(m => {
        const { MIEMBRO, LIDER, CLIENTE_EXPERTO, LIDER_GARANTIA } = TiposMiembro;
        const montoValido = [MIEMBRO, LIDER, CLIENTE_EXPERTO, LIDER_GARANTIA].includes(m.tipoMiembro.id) ?
          this.resultadoSimulador?.montoSolicitado <= this.montoMaxAprobacion : true;
        const plazoValido = this.resultadoSimulador.plazo <= this.plazoMaxAprobacion;
        return montoValido && plazoValido;
      });

      const { rechaza } = this.solicitud
      if (this.session.user.rol.id !== Roles.COORDINADOCREDITO) {
        this.permitePasoValidarIdentidad = this.solicitud.estado === EstadoSolicitud.ValidacionGerente ?
          apruebaComoGrte && rechaza?.idRol !== Roles.COMITE : true;
      } else {
        // Si es coordinador de crédito (rol 13), permitir el paso siempre
        this.permitePasoValidarIdentidad = true;
      }
    }
  }

}


class AprobacionesForm extends FormGroup {

  public identificacion: any;
  public renovacion: any;

  constructor({ datosIdentificacionCliente, aprobacion, fotos: fotodex }: Cliente, { renovacion, fotos: repositorio }: Solicitudes) {
    super({
      fotos: new FormControl(aprobacion?.fotos || false),
      firmas: new FormControl(aprobacion?.firmas || false),
      seguros: new FormControl(aprobacion?.seguros || false),
      referenciasArriendoLocal: new FormControl(aprobacion?.referenciasArriendoLocal || false),
      referenciasArriendoVivienda: new FormControl(aprobacion?.referenciasArriendoVivienda || false),
      aprobacionReferenciasLaborales: new FormControl(aprobacion?.aprobacionReferenciasLaborales || false),
      historial: new FormControl(aprobacion?.historial || false),
      clienteExperto: new FormControl(aprobacion?.clienteExperto || false),
      preguntasOTP: new FormControl(aprobacion?.preguntasOTP || false)
    });

    this.identificacion = datosIdentificacionCliente.numeroIdentificacion;
    this.renovacion = renovacion;
  }

  reset({ aprobacion }: Cliente, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.reset({
      fotos: aprobacion?.fotos || false,
      firmas: aprobacion?.firmas || false,
      seguros: aprobacion?.seguros || false,
      referenciasArriendoLocal: aprobacion?.referenciasArriendoLocal || false,
      referenciasArriendoVivienda: aprobacion?.referenciasArriendoVivienda || false,
      aprobacionReferenciasLaborales: aprobacion?.aprobacionReferenciasLaborales || false,
      historial: aprobacion?.historial || false,
      clienteExperto: aprobacion?.clienteExperto || false,
      preguntasOTP: aprobacion?.preguntasOTP || false,
    }, { ...options, emitEvent: false });
  }

  getRawValue(): any {
    return { identificacion: this.identificacion.toString(), aprobacion: super.getRawValue() };
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

class AprobacionesHistorialForm extends FormGroup {

  public identificacion: any;

  constructor({ datosIdentificacionCliente, aprobacion, fotos: fotodex }: Cliente, { fotos: repositorio }: Solicitudes) {
    super({
      fotos: new FormControl(aprobacion?.fotos || false),
      firmas: new FormControl(aprobacion?.firmas || false),
      seguros: new FormControl(aprobacion?.seguros || false),
      referenciasArriendoLocal: new FormControl(aprobacion?.referenciasArriendoLocal || false),
      referenciasArriendoVivienda: new FormControl(aprobacion?.referenciasArriendoVivienda || false),
      aprobacionReferenciasLaborales: new FormControl(aprobacion?.aprobacionReferenciasLaborales || false),
      historial: new FormControl(aprobacion?.historial || false),
      clienteExperto: new FormControl(aprobacion?.clienteExperto || false),
      preguntasOTP: new FormControl(aprobacion?.preguntasOTP || false)
    });

    this.identificacion = datosIdentificacionCliente.numeroIdentificacion;
  }

  reset({ aprobacion }: Cliente, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.reset({
      fotos: aprobacion?.fotos || false,
      firmas: aprobacion?.firmas || false,
      seguros: aprobacion?.seguros || false,
      referenciasArriendoLocal: aprobacion?.referenciasArriendoLocal || false,
      referenciasArriendoVivienda: aprobacion?.referenciasArriendoVivienda || false,
      aprobacionReferenciasLaborales: aprobacion?.aprobacionReferenciasLaborales || false,
      historial: aprobacion?.historial || false,
      clienteExperto: aprobacion?.clienteExperto || false,
      preguntasOTP: aprobacion?.preguntasOTP || false
    }, { ...options, emitEvent: false });
  }

  getRawValue(): any {
    return { identificacion: this.identificacion.toString(), aprobacion: super.getRawValue() };
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

class ForzarOTPForm extends FormGroup {

  public identificacion: any;

  constructor({ datosIdentificacionCliente, otp: { validadoGerente } }: Cliente) {
    super({
      validadoGerente: new FormControl(validadoGerente || false)
    });

    this.identificacion = datosIdentificacionCliente.numeroIdentificacion;
  }

  reset({ otp: { validadoGerente } }: Cliente, options?: { onlySelf?: boolean; emitEvent?: boolean }): void {
    super.reset({
      validadoGerente: validadoGerente || false
    }, { ...options, emitEvent: false });
  }

  getRawValue(): any {
    return { identificacion: this.identificacion.toString(), ...super.getRawValue() };
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
