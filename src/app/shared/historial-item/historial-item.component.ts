import {Component, Input, OnInit} from '@angular/core';
import {
  HCCalificacionCAAndCC,
  HCCalificacionTCAndCC,
  HCEstadoCivilGenero,
  HCEstadoDocumento,
  HCEstadoCuentaTCandCC,
  HCSector,
  HCTipoIdentificacion,
  HCTiposCuentas,
  HCEstadoPagoTarjetaCartera,
  HCEstadoCuentaCcANDCa,
  HCSituacionTitular,
  HCClaseTC,
  HCClaseCuentaAC,
  HCGarantiaHabitoPagoObligacionesVigentes, HCCodigosGarante
} from '../../core/constants';
import * as moment from 'moment';

@Component({
  selector: 'app-historial-item',
  templateUrl: './historial-item.component.html',
  styleUrls: ['./historial-item.component.scss']
})
export class HistorialItemComponent implements OnInit {

  @Input() historial: any;

  infoBasica: InfoBasica;
  resumen: Resumen;
  habitoPagoObligaciones: HabitoPagoObligaciones;
  analisisVectores: AnalisisVector;
  evolucionDeuda: EvolucionDeuda;
  historicoConsultas: HistoricoConsultas;

  constructor() {
  }

  ngOnInit(): void {
    this.infoBasica = new InfoBasica(this.historial);
    this.resumen = new Resumen(this.historial);
    this.habitoPagoObligaciones = new HabitoPagoObligaciones(this.historial);
    this.analisisVectores = new AnalisisVector(this.historial);
    this.evolucionDeuda = new EvolucionDeuda(this.historial);
    this.historicoConsultas = new HistoricoConsultas(this.historial);
  }

  get keys(): string[] {
    return typeof this.historial === 'object' && !Array.isArray(this.historial) ? Object.keys(this.historial) : null;
  }

  keyIsObject(key: string): boolean {
    return typeof this.historial[key] === 'object' && !Array.isArray(this.historial[key]);
  }

  keyIsArray(key: string): boolean {
    return Array.isArray(this.historial[key]);
  }

  keyIsValue(key: string): string | number | boolean {
    return ['string', 'number', 'boolean'].includes(typeof this.historial[key]);
  }

  toCapitalizedWords(key): string {
    const words = key.match(/[A-Za-z][a-z]*|[0-9]+/g) || [];
    return words.map(this.capitalize).join(' ');
  }

  capitalize(word): string {
    return word.charAt(0).toUpperCase() + word.substring(1);
  }
}

class InfoBasica {
  private historial: any;

  constructor(historial: any) {
    this.historial = historial;
  }

  get tipoDocumento(): string {
    const {tipoIdentificacion} = this.historial.CuentaAhorro[0]?.obj ||
    this.historial.CuentaCartera[0]?.obj ||
    this.historial.CuentaCorriente[0]?.obj ||
    this.historial.TarjetaCredito[0]?.obj;

    return HCTipoIdentificacion[tipoIdentificacion];
  }

  get numeroDocumento(): number {
    const {numero} = this.historial.NaturalNacional[0].Identificacion[0]?.obj;
    return Number(numero);
  }

  get estadoDocumento(): string {
    const {estado} = this.historial.NaturalNacional[0].Identificacion[0]?.obj;
    return HCEstadoDocumento[estado];
  }

  get lugarExpedicionDocumento(): string {
    return this.historial.NaturalNacional[0].Identificacion[0]?.obj?.ciudad;
  }

  get fechaExpedicionDocumento(): string {
    return this.historial.NaturalNacional[0].Identificacion[0]?.obj?.fechaExpedicion;
  }

  get nombre(): string {
    return this.historial.NaturalNacional[0]?.obj?.nombreCompleto;
  }

  get rangoEdad(): string {
    const {obj: {min, max}} = this.historial.NaturalNacional[0].Edad[0];
    return `${min}-${max}`;
  }

  get genero(): string {
    const {obj: {genero, estadoCivil}} = this.historial.NaturalNacional[0] || this.historial.NaturalNacional[0].Identificacion[0];
    return HCEstadoCivilGenero[genero || estadoCivil];
  }

  get RUT(): string {
    const {obj: {rut}} = this.historial.NaturalNacional[0];
    return [true, 'true'].includes(rut) ? 'SÍ' : 'NO';
  }

}

class Resumen {
  private historial: any;

  perfilGeneral: any;
  saldosYmoras: { [fecha: string]: SaldosYMoras };
  endeudamientoActual: SectorEndeudamientoActual[];

  constructor(historial: any) {
    this.historial = historial;

    this.buildPerfilGeneral();
    this.buildSaldosYMoras();
    this.buildEndeudamientoActual();
  }

  get saldosYmorasFechas(): string[] {
    return Object.keys(this.saldosYmoras);
  }

  buildPerfilGeneral(): any {
    const {
      AntiguedadDesde,
      ConsultaUlt6Meses,
      CreditosCerrados,
      CreditosReestructurados,
      CreditosRefinanciados,
      CreditosVigentes,
      Desacuerdos,
    } = this.historial.InfoAgregadaMicrocredito[0]?.Resumen[0]?.PerfilGeneral[0];

    this.perfilGeneral = {
      antiguedadDesde: new PerfilGeneral(AntiguedadDesde),
      consultaUlt6Meses: new PerfilGeneral(ConsultaUlt6Meses),
      creditosCerrados: new PerfilGeneral(CreditosCerrados),
      creditosReestructurados: new PerfilGeneral(CreditosReestructurados),
      creditosRefinanciados: new PerfilGeneral(CreditosRefinanciados),
      creditosVigentes: new PerfilGeneral(CreditosVigentes),
      desacuerdos: new PerfilGeneral(Desacuerdos),
    };
  }

  buildSaldosYMoras(): void {
    const {SaldosYMoras: saldosYMoras} = this.historial.InfoAgregadaMicrocredito[0]?.Resumen[0]?.VectorSaldosYMoras[0];
    this.saldosYmoras = saldosYMoras.reduce((map, s) => {
      const {fecha, ...rest} = s.obj;

      if (!map[fecha]) {
        map[fecha] = new SaldosYMoras(rest);
      }

      return map;
    }, {} as { [fecha: string]: SaldosYMoras });
  }

  buildEndeudamientoActual(): void {
    const {Sector: sectores} = this.historial.InfoAgregadaMicrocredito[0]?.Resumen[0]?.EndeudamientoActual[0];
    this.endeudamientoActual = sectores.map(s => new SectorEndeudamientoActual(s));
  }
}

class PerfilGeneral {

  private perfil: any;

  constructor(perfil: any) {
    this.perfil = perfil[0];
  }

  get sectorCooperativo(): string {
    const {sectorCooperativo} = this.perfil?.obj;
    return sectorCooperativo;
  }

  get sectorFinanciero(): string {
    const {sectorFinanciero} = this.perfil?.obj;
    return sectorFinanciero;
  }

  get sectorReal(): string {
    const {sectorReal} = this.perfil?.obj;
    return sectorReal;
  }

  get sectorTelcos(): string {
    const {sectorTelcos} = this.perfil?.obj;
    return sectorTelcos;
  }

  get totalSectores(): number {
    const {
      sectorCooperativo,
      sectorFinanciero,
      sectorReal,
      sectorTelcos
    } = this.perfil?.obj;
    return (+sectorCooperativo) + (+sectorFinanciero) + (+sectorReal) + (+sectorTelcos);
  }

  get totalComoPrincipal(): string {
    const {totalComoPrincipal} = this.perfil?.obj;
    return totalComoPrincipal;
  }

  get totalComoCodeudorYOtros(): string {
    const {totalComoCodeudorYOtros} = this.perfil?.obj;
    return totalComoCodeudorYOtros;
  }

}

class SaldosYMoras {

  private obj: any;

  constructor(obj: any) {
    this.obj = obj;
  }

  get saldoDeudaTotalMora(): number | string {
    const {saldoDeudaTotalMora} = this.obj;
    return saldoDeudaTotalMora;
  }

  get saldoDeudaTotal(): number | string {
    const {saldoDeudaTotal} = this.obj;
    return saldoDeudaTotal;
  }

  get morasMaxSectorFinanciero(): number | string {
    const {morasMaxSectorFinanciero} = this.obj;
    return morasMaxSectorFinanciero;
  }

  get morasMaxSectorCooperativo(): number | string {
    const {morasMaxSectorCooperativo} = this.obj;
    return morasMaxSectorCooperativo;
  }

  get morasMaxSectorReal(): number | string {
    const {morasMaxSectorReal} = this.obj;
    return morasMaxSectorReal;
  }

  get morasMaxSectorTelcos(): number | string {
    const {morasMaxSectorTelcos} = this.obj;
    return morasMaxSectorTelcos;
  }

  get morasMax(): number | string {
    const {morasMax} = this.obj;
    return morasMax;
  }

  get totalCuentasMora(): number | string {
    const {saldoDeudaTotalMora} = this.obj;
    return saldoDeudaTotalMora;
  }

  get numCreditos30(): number | string {
    const {numCreditos30} = this.obj;
    return numCreditos30;
  }

  get numCreditosMayorIgual60(): number | string {
    const {numCreditosMayorIgual60} = this.obj;
    return numCreditosMayorIgual60;
  }
}

class SectorEndeudamientoActual {

  obj: any;
  // tslint:disable-next-line:variable-name
  private _tipoCuenta: TipoCuentaEndeudamientoActual;

  constructor({obj, TipoCuenta}: any) {
    this.obj = obj;
    this._tipoCuenta = new TipoCuentaEndeudamientoActual(TipoCuenta[0]);
  }

  get descripcion(): string {
    const {codSector} = this.obj;
    return HCSector[codSector];
  }

  get tipoCuenta(): TipoCuentaEndeudamientoActual {
    return this._tipoCuenta;
  }
}

class TipoCuentaEndeudamientoActual {

  obj: any;

  // tslint:disable:variable-name
  _tipoUsuario: any;
  _cuentas: CuentaEndeudamientoActual[];

  constructor({obj, Usuario: {0: {obj: {tipoUsuario}, Cuenta: cuentas}}}: any) {
    this.obj = obj;
    this._tipoUsuario = tipoUsuario;
    this._cuentas = cuentas.map(c => new CuentaEndeudamientoActual(c));
  }

  get descripcion(): string {
    const {tipoCuenta} = this.obj;
    return HCTiposCuentas[tipoCuenta];
  }

  get tipoUsuario(): string {
    return this._tipoUsuario;
  }

  get cuentas(): CuentaEndeudamientoActual[] {
    return this._cuentas;
  }
}

class CuentaEndeudamientoActual {

  obj: any;

  constructor({obj}: any) {
    this.obj = obj;
  }

  get estadoActual(): string {
    const {estadoActual} = this.obj;
    return estadoActual;
  }

  get calificacion(): string {
    const {calificacion} = this.obj;
    return calificacion;
  }

  get valorInicial(): number | string {
    const {valorInicial} = this.obj;
    return valorInicial;
  }

  get saldoActual(): number | string {
    const {saldoActual} = this.obj;
    return saldoActual;
  }

  get saldoMora(): number | string {
    const {saldoMora} = this.obj;
    return saldoMora;
  }

  get valorCuota(): number | string {
    const {cuotaMes} = this.obj;
    return cuotaMes;
  }

  get porcentajePart(): number | string {
    const {porcentajePart} = this.obj;
    return porcentajePart;
  }

  get porcentajeDeuda(): number | string {
    const {porcentajeDeuda} = this.obj;
    return porcentajeDeuda;
  }
}

class HabitoPagoObligaciones {

  vigentes = {
    sectorFinanciero: [],
    sectorCooperativo: [],
    sectorReal: [],
    sectorTelecomunicaciones: [],
  };
  cerradas = {
    sectorFinanciero: [],
    sectorCooperativo: [],
    sectorReal: [],
    sectorTelecomunicaciones: [],
  };

  private sectorFinanciero: InfoHabitoPagoObligaciones[] = [];
  private sectorCooperativo: InfoHabitoPagoObligaciones[] = [];
  private sectorReal: InfoHabitoPagoObligaciones[] = [];
  private sectorTelecomunicaciones: InfoHabitoPagoObligaciones[] = [];

  constructor(historial: any) {

    // sectorizar obligaciones
    this.buildSectorFinanciero(historial);
    this.buildSectorTelcos(historial);
    this.buildSectorReal(historial);
    this.buildSectorCooperativo(historial);

    // clasificar obligaciones (Abiertas - Cerradas)
    this.clasificarObligacionesVigentes();
    this.clasificarObligacionesCerradas();

    // console.log(this.sectorTelecomunicaciones);
    // console.log(this.sectorReal);
    // console.log(this.sectorFinanciero);

  }

  private buildSectorFinanciero({CuentaCartera, CuentaAhorro, CuentaCorriente, TarjetaCredito}: any): void {
    // Extraer por atributo cada item con sector = 1 (FINANCIERO)

    this.sectorFinanciero = CuentaCartera ?
      [...this.sectorFinanciero, ...CuentaCartera.filter(({obj}) => obj.sector === '1').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorFinanciero;

    this.sectorFinanciero = CuentaAhorro ?
      [...this.sectorFinanciero, ...CuentaAhorro.filter(({obj}) => obj.sector === '1').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorFinanciero;

    this.sectorFinanciero = CuentaCorriente ?
      [...this.sectorFinanciero, ...CuentaCorriente.filter(({obj}) => obj.sector === '1').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorFinanciero;

    this.sectorFinanciero = TarjetaCredito ?
      [...this.sectorFinanciero, ...TarjetaCredito.filter(({obj}) => obj.sector === '1').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorFinanciero;
  }

  private buildSectorCooperativo({CuentaCartera, CuentaAhorro, CuentaCorriente, TarjetaCredito}: any): void {
    // Extraer por atributo cada item con sector = 2 (COOPERATIVO)

    this.sectorCooperativo = CuentaCartera ?
      [...this.sectorCooperativo, ...CuentaCartera.filter(({obj}) => obj.sector === '2').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorCooperativo;

    this.sectorCooperativo = CuentaAhorro ?
      [...this.sectorCooperativo, ...CuentaAhorro.filter(({obj}) => obj.sector === '2').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorCooperativo;

    this.sectorCooperativo = CuentaCorriente ?
      [...this.sectorCooperativo, ...CuentaCorriente.filter(({obj}) => obj.sector === '2').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorCooperativo;

    this.sectorCooperativo = TarjetaCredito ?
      [...this.sectorCooperativo, ...TarjetaCredito.filter(({obj}) => obj.sector === '2').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorCooperativo;
  }

  private buildSectorReal({CuentaCartera, CuentaAhorro, CuentaCorriente, TarjetaCredito}: any): void {
    // Extraer por atributo cada item con sector = 3 (REALsectorReal)

    this.sectorReal = CuentaCartera ?
      [...this.sectorReal, ...CuentaCartera.filter(({obj}) => obj.sector === '3').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorReal;

    this.sectorReal = CuentaAhorro ?
      [...this.sectorReal, ...CuentaAhorro.filter(({obj}) => obj.sector === '3').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorReal;

    this.sectorReal = CuentaCorriente ?
      [...this.sectorReal, ...CuentaCorriente.filter(({obj}) => obj.sector === '3').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorReal;

    this.sectorReal = TarjetaCredito ?
      [...this.sectorReal, ...TarjetaCredito.filter(({obj}) => obj.sector === '3').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorReal;
  }

  private buildSectorTelcos({CuentaCartera, CuentaAhorro, CuentaCorriente, TarjetaCredito}: any): void {
    // Extraer por atributo cada item con sector = 4 (TELECOMUNICACIONES)

    this.sectorTelecomunicaciones = CuentaCartera ?
      [...this.sectorTelecomunicaciones, ...CuentaCartera.filter(({obj}) => obj.sector === '4').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorTelecomunicaciones;

    this.sectorTelecomunicaciones = CuentaAhorro ?
      [...this.sectorTelecomunicaciones, ...CuentaAhorro.filter(({obj}) => obj.sector === '4').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorTelecomunicaciones;

    this.sectorTelecomunicaciones = CuentaCorriente ?
      [...this.sectorTelecomunicaciones, ...CuentaCorriente.filter(({obj}) => obj.sector === '4').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorTelecomunicaciones;

    this.sectorTelecomunicaciones = TarjetaCredito ?
      [...this.sectorTelecomunicaciones, ...TarjetaCredito.filter(({obj}) => obj.sector === '4').map(item => new InfoHabitoPagoObligaciones(item))] :
      this.sectorTelecomunicaciones;
  }

  private clasificarObligacionesVigentes(): void {
    this.vigentes.sectorFinanciero = this.sectorFinanciero.filter((item) => item.vigente);
    this.vigentes.sectorCooperativo = this.sectorCooperativo.filter((item) => item.vigente);
    this.vigentes.sectorReal = this.sectorReal.filter((item) => item.vigente);
    this.vigentes.sectorTelecomunicaciones = this.sectorTelecomunicaciones.filter((item) => item.vigente);
  }

  private clasificarObligacionesCerradas(): void {
    this.cerradas.sectorFinanciero = this.sectorFinanciero.filter((item) => !item.vigente);
    this.cerradas.sectorCooperativo = this.sectorCooperativo.filter((item) => !item.vigente);
    this.cerradas.sectorReal = this.sectorReal.filter((item) => !item.vigente);
    this.cerradas.sectorTelecomunicaciones = this.sectorTelecomunicaciones.filter((item) => !item.vigente);
  }
}

class InfoHabitoPagoObligaciones {
  private infoHabitoPago: any;

  constructor(infoHabitoPago: any) {
    this.infoHabitoPago = infoHabitoPago;
  }

  get entidadInformante(): string {
    return this.infoHabitoPago.obj?.entidad;
  }

  get tipoCuenta(): string {
    return this.tipo === 1 ? this.infoHabitoPago.Caracteristicas[0]?.obj?.tipoCuenta :
      this.tipo === 2 ? 'TDC' : this.tipo === 3 ? 'AHO' : this.tipo === 4 ? 'CCB' : 'N/A';
  }

  get numeroCuenta(): string {
    return this.infoHabitoPago.obj?.numero;
  }

  get calificacion(): string {
    const {calificacion} = this.infoHabitoPago.obj || this.infoHabitoPago.Valores[0]?.Valor?.obj;

    if (this.tipo === 3 || this.tipo === 4) {
      return HCCalificacionCAAndCC[calificacion];
    } else {
      return HCCalificacionTCAndCC[this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.calificacion];
    }
  }

  get vigente(): boolean {
    const {Estado, Estados, obj} = this.infoHabitoPago;
    const codigoEstadoCuenta = (Estados && Estados[0]?.EstadoCuenta[0]?.obj?.codigo) || (Estado && Estado[0]?.obj?.codigo);
    const codigoEstadopago = Estados && Estados[0]?.EstadoPago[0]?.obj?.codigo;
    const formaPago = obj && obj.formaPago || '';
    const estado10 = codigoEstadoCuenta === 10 && HCEstadoCuentaTCandCC[codigoEstadoCuenta]?.vigente;
    const estado46_3 = (codigoEstadopago === 46 && formaPago === 3) && false;
    const estado46_dif3 = (codigoEstadopago === 46 && formaPago !== 3) && false;
    const estadoDefault = !estado10 && !estado46_3 && !estado46_dif3 && HCEstadoPagoTarjetaCartera[codigoEstadopago]?.vigente;

    return (this.tipo === 1 || this.tipo === 2) ?
      estado10 || estado46_3 || estado46_dif3 || estadoDefault :
      (this.tipo === 3 || this.tipo === 4) ? HCEstadoCuentaCcANDCa[codigoEstadoCuenta]?.vigente : false;
  }

  get estadoObligacion(): string {
    const {Estado, Estados, obj} = this.infoHabitoPago;
    const codigoEstadoCuenta = (Estados && Estados[0]?.EstadoCuenta[0]?.obj?.codigo) || (Estado && Estado[0]?.obj?.codigo);
    const codigoEstadopago = Estados && Estados[0]?.EstadoPago[0]?.obj?.codigo;
    const formaPago = obj && obj.formaPago || '';
    const estado10 = codigoEstadoCuenta === 10 && HCEstadoCuentaTCandCC[codigoEstadoCuenta]?.descripcion;
    const estado46_3 = (codigoEstadopago === 46 && formaPago === 3) && 'Pago Jur.';
    const estado46_dif3 = (codigoEstadopago === 46 && formaPago !== 3) && 'Pago Vol.';
    const estadoDefault = !estado10 && !estado46_3 && !estado46_dif3 && HCEstadoPagoTarjetaCartera[codigoEstadopago]?.descripcion;


    return (this.tipo === 1 || this.tipo === 2) ?
      estado10 || estado46_3 || estado46_dif3 || estadoDefault :
      (this.tipo === 3 || this.tipo === 4) ? HCEstadoCuentaCcANDCa[codigoEstadoCuenta]?.descripcion : 'N/A';
  }

  get fechaActualizacion(): string {
    const {Estado, Estados} = this.infoHabitoPago;

    return (Estados && Estados[0]?.EstadoPago[0]?.obj?.fecha) || (Estado && Estado[0]?.obj?.fecha);
  }

  get adjetivoFecha(): string {
    return '-';
  }

  get fechaApertura(): string {
    return this.infoHabitoPago.obj?.fechaApertura || '-';
  }

  get fechaVencimiento(): string {
    return this.infoHabitoPago.obj?.fechaVencimiento || '-';
  }

  // por revisar como calcular la mora
  get moraMaxima(): string {
    return '-';
  }

  // por revisar no hay informacion
  get desacuerdoInformacion(): string {
    return '-';
  }

  get estadoTitular(): string {
    const situacionTitular = this.infoHabitoPago.obj?.situacionTitular;

    return HCSituacionTitular[situacionTitular];
  }

  get clase(): string {
    const {clase} = this.infoHabitoPago.Caracteristicas[0].obj;

    return (this.tipo === 2) ? clase && HCClaseTC[clase] :
      (this.tipo === 3 || this.tipo === 4) ? clase && HCClaseCuentaAC[clase] : '-';
  }

  get tipoGarantia(): string {
    const {garantia} = this.infoHabitoPago.Caracteristicas[0].obj;

    return (this.tipo === 1 || this.tipo === 2) ?
      HCGarantiaHabitoPagoObligacionesVigentes[garantia] : '-';
  }

  get cupoInicial(): string {
    return this.tipo === 1 ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.valorInicial :
      this.tipo === 2 ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.cupoTotal : '-';
  }

  get saldoActual(): string {
    return (this.tipo === 1 || this.tipo === 2) ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.saldoActual : '-';
  }

  get saldoMora(): string {
    return (this.tipo === 1 || this.tipo === 2) ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.saldoMora : '-';
  }

  get valorCuota(): string {
    return (this.tipo === 1 || this.tipo === 2) ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.cuota : '-';
  }

  get fechaLimitePago(): string {
    return (this.tipo === 1 || this.tipo === 2) ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.fechaLimitePago : '-';
  }

  get fechaPago(): string {
    return (this.tipo === 1 || this.tipo === 2) ? this.infoHabitoPago.Valores[0]?.Valor[0]?.obj?.fechaPagoCuota : '-';
  }

  get perm(): string {
    return '-';
  }

  get numeroChequesDevueltos(): string {
    return '-';
  }

  get cuotasMVigencia(): string {
    return this.tipo === 1 ? '-' :
      this.tipo === 2 ? '-/M/-' : '-';
  }

  get deuda(): string {
    return this.tipo === 1 || this.tipo === 2 ? `${((+this.saldoActual / +this.cupoInicial) * 100).toFixed(1)}%` : '-';
  }

  get oficinaDeudor(): string {
    const codigoDeudor = this.tipo === 1 ? this.infoHabitoPago.Caracteristicas[0]?.obj?.calidadDeudor : this.tipo === 2 ? this.infoHabitoPago.Caracteristicas[0]?.obj?.codigoAmparada : '-';
    const EstadoDeudor = (codigoDeudor >= 10 && codigoDeudor <= 95) ? 'No Aplica' : (codigoDeudor === '-') ? codigoDeudor : HCCodigosGarante[codigoDeudor];
    return `${this.infoHabitoPago.obj?.oficina} / ${EstadoDeudor}`;
  }

  get comportamiento(): string {
    const {comportamiento} = this.infoHabitoPago.obj;
    const grupo1 = comportamiento ? `[${comportamiento.substring(0, 12)}]` : '';
    const grupo2 = comportamiento ? `[${comportamiento.substring(12, 24)}]` : '';
    const grupo3 = comportamiento ? `[${comportamiento.substring(24, 36)}]` : '';
    const grupo4 = comportamiento ? `[${comportamiento.substring(36)}]` : '';

    return `${grupo1} ${grupo2} ${grupo3} ${grupo4}`;
  }

  private get tipo(): number {
    const CARACTERISTICAS_CC = [
      'garantia',
      'calidadDeudor',
      'ejecucionContrato',
      'mesesPermanencia',
      'tipoContrato',
      'tipoCuenta',
      'tipoObligacion',
    ];

    const CARACTERISTICAS_TDC = [
      'amparada',
      'clase',
      'codigoAmparada',
      'franquicia',
      'garantia',
      'marca',
    ];

    const CARACTERISTICAS_CAH_CORRIENTE = ['clase'];

    const caracteristicasKeys = Object.keys(this.infoHabitoPago.Caracteristicas[0]?.obj);

    return CARACTERISTICAS_CC.every(k => caracteristicasKeys.includes(k)) ? 1 :
      CARACTERISTICAS_TDC.every(k => caracteristicasKeys.includes(k)) ? 2 :
      (CARACTERISTICAS_CAH_CORRIENTE.every(k => caracteristicasKeys.includes(k)) && this.infoHabitoPago.Valores) ? 3 :
      (CARACTERISTICAS_CAH_CORRIENTE.every(k => caracteristicasKeys.includes(k)) && !this.infoHabitoPago.Valores) ? 4 : 0;
  }

}

class AnalisisVector {

  sectores: SectorAnalisisVector[] = [];

  private historial: any;

  constructor(historial: any) {
    this.historial = historial;

    this.buildSectores();

    console.log(this.sectores);
  }

  private buildSectores(): void {

    const { Sector } = this.historial.InfoAgregadaMicrocredito[0]?.AnalisisVectores[0];

    this.sectores = Sector ?
      [...this.sectores, ...Sector.map((s) => new SectorAnalisisVector(s))] :
      this.sectores;
  }
}

class SectorAnalisisVector {

  private sector: any;

  constructor(sector: any) {
    this.sector = sector;
  }

  get nombreSector(): string {
    return this.sector.obj?.nombreSector;
  }

  get cuentas(): CuentaAnalisisVector[] {
    return this.sector.Cuenta.map(c => new CuentaAnalisisVector(c));
  }

  get comportamiento(): Comportamiento[] {
    return this.sector.MorasMaximas[0]?.CaracterFecha.map(cf => new Comportamiento(cf));
  }
}

class CuentaAnalisisVector {
  private cuenta: any;

  constructor(cuenta: any) {
    this.cuenta = cuenta;
  }

  get entidad(): string {
    return this.cuenta.obj?.entidad;
  }

  get numeroCuenta(): string {
    return this.cuenta.obj?.numeroCuenta;
  }

  get tipoCuenta(): string {
    return this.cuenta.obj?.tipoCuenta;
  }

  get estado(): string {
    return this.cuenta.obj?.estado;
  }

  get comportamiento(): Comportamiento[] {
    return this.cuenta.CaracterFecha.reverse().map(cf => new Comportamiento(cf));
  }
}

class Comportamiento {
  private caracterFecha: any;

  constructor(caracterFecha: any) {
    this.caracterFecha = caracterFecha;
  }

  get mesDia(): string {
    return moment(this.caracterFecha.obj?.fecha).format('MMM DD');
  }

  get reporte(): string {
    return this.caracterFecha.obj?.saldoDeudaTotalMora ? this.caracterFecha.obj?.saldoDeudaTotalMora : '';
  }
}

class EvolucionDeuda {
  sectores: SectorEvolucionDeuda[] = [];
  trimestres: string[] = [];

  private historial: any;

  constructor(historial: any) {
    this.historial = historial;

    this.buildSectores();
    this.buildTrimestres();

    console.log(this.sectores);
  }

  private buildSectores(): void {

    const { EvolucionDeudaSector } = this.historial.InfoAgregadaMicrocredito[0]?.EvolucionDeuda[0];

    this.sectores = EvolucionDeudaSector ?
      [...this.sectores, ...EvolucionDeudaSector.map((s) => new SectorEvolucionDeuda(s))] :
      this.sectores;
  }

  private buildTrimestres(): void {
    const {Trimestre} = this.historial.InfoAgregadaMicrocredito[0]?.EvolucionDeuda[0].Trimestres[0];

    this.trimestres = Trimestre ? [...this.trimestres, ...Trimestre] : this.trimestres;
  }
}

class SectorEvolucionDeuda {

  private sector: any;

  constructor(sector: any) {
    this.sector = sector;
  }

  get nombreSector(): string {
    const {nombreSector} = this.sector.obj;
    return `Sector ${nombreSector}`;
  }

  get cuentas(): CuentaEvolucionDeuda[] {
    return this.sector.EvolucionDeudaTipoCuenta.map(ce => new CuentaEvolucionDeuda(ce));
  }
}

class CuentaEvolucionDeuda {

  private cuenta: any;

  constructor(cuenta: any) {
    this.cuenta = cuenta;
  }

  get tipoCuenta(): string {
    const {tipoCuenta} = this.cuenta.obj;

    return HCTiposCuentas[tipoCuenta];
  }

  get num(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.num);
  }

  get cupoInicial(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.cupoInicial);
  }

  get saldo(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.saldo);
  }

  get saldoMora(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.saldoMora);
  }

  get valorCuota(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.cuota);
  }

  get porcDeuda(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.porcentajeDeuda);
  }

  get calificacion(): string[] {
    const  {EvolucionDeudaValorTrimestre} = this.cuenta;

    return EvolucionDeudaValorTrimestre.map(({obj}) => obj.textoMenorCalificacion);
  }


}

class HistoricoConsultas {
  consultas: any[] = [];

  private historial: any;

  constructor(historial: any) {
    this.historial = historial;

    this.buildConsultas();
  }

  private buildConsultas(): void {
    const  {Consulta} = this.historial;

    this.consultas = Consulta ? [...this.consultas, ...Consulta.map(({obj}) => obj)] : this.consultas;

  }
}
