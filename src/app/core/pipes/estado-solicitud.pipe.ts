import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'estadoStep'
})
export class EstadoSolicitudPipe implements PipeTransform {

  estadosPermitidos = [45, 50, 55, 60];

  transform(value: EstadoSolicitud, step: 'validacion' | 'aprobacion' | 'comite' | 'otp', ...args: unknown[]): unknown {
    if (value && step) {
      switch (step) {
        case 'validacion':

          switch (value) {
            case EstadoSolicitud.ValidacionAsistente:
              return 'En progreso';
            case EstadoSolicitud.ValidacionGerente:
            case EstadoSolicitud.Comite:
            case EstadoSolicitud.ValidacionIdentidad:
            case EstadoSolicitud.LegalizandoCredito:
              return 'Completado';
            default:
              return 'Pendiente';
          }

        case 'aprobacion':
          switch (value) {
            case EstadoSolicitud.ValidacionGerente:
              return 'En progreso';
            case EstadoSolicitud.Comite:
            case EstadoSolicitud.ValidacionIdentidad:
            case EstadoSolicitud.LegalizandoCredito:
              return 'Completado';
            default:
              return 'Pendiente';
          }
        case 'comite':
          switch (value) {
            case EstadoSolicitud.Comite:
              return 'En progreso';
            case EstadoSolicitud.ValidacionIdentidad:
            case EstadoSolicitud.LegalizandoCredito:
              return 'Completado';
            default:
              return 'Pendiente';
          }
        case 'otp':
          switch (value) {
            case EstadoSolicitud.ValidacionAsistente:
            case EstadoSolicitud.ValidacionGerente:
            case EstadoSolicitud.Comite:
              return 'Pendiente';
            case EstadoSolicitud.ValidacionIdentidad:
              return 'En progreso';
            default:
              return 'Completado';
          }
      }
    }
    return null;
  }

}

export enum EstadoSolicitud {
  Incompleta = 1,
  Cancelada = 5,
  RenovacionActiva = 7,
  RenovacionNoCumplePoliticas = 8,
  Devuelta = 10,
  Creada = 20,
  Anulada = 35,
  Sincronizada = 40,
  ValidacionAsistente = 45,
  ValidacionGerente = 50,
  Comite = 55,
  ValidacionIdentidad = 60,
  AltaCliente62 = 62,
  AltaCliente63 = 63,
  AltaCliente64 = 64,
  Rechazada = 65,
  AltaClienteEnviado = 66,
  AltaClienteValidar = 67,
  LegalizandoCredito = 70,
  ErrorCreacionCredito = 71,
  AnuladasPorCore = 73,
  AsociandoCodeudores = 74,
  GenerandoDesembolso = 75,
  ErrorAsociarCodeudores = 76,
  DesembolsoConfirmado = 80,
  DesembolsoFallido = 81,
  AsociacionCodeudoresFallida = 82,
  enDispersion = 90,
  enDispersionEstado = 95,
  AprobadaDesembolsada = 100,
  Dispersion = 120,
  Finalizada = 200,
}
