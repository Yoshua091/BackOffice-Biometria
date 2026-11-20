import { Pipe, PipeTransform } from '@angular/core';
import { EstadoSolicitud } from './estado-solicitud.pipe';

@Pipe({
  name: 'estadoFecha'
})
export class EstadoFechaPipe implements PipeTransform {


  transform(value: any, data: EstadoSolicitud, ...args: unknown[]): unknown {
    if (value && data) {
      switch (data[0]) {
        case EstadoSolicitud.Comite:
          const filtroComite = value.filter(item => item.estado.idEstado === EstadoSolicitud.Comite);
          const ultimoRegistroComite = filtroComite[filtroComite.length - 1];
          return ultimoRegistroComite;
        case EstadoSolicitud.ValidacionGerente:
          const filtroEnAprobacion = value.filter(item => item.estado.idEstado === EstadoSolicitud.ValidacionGerente);
          const ultimoRegistroEnAprobacion = filtroEnAprobacion[filtroEnAprobacion.length - 1];
          return ultimoRegistroEnAprobacion;
        case EstadoSolicitud.ValidacionIdentidad:
          const filtroOtp = value.filter(item => item.estado.idEstado === EstadoSolicitud.ValidacionIdentidad);
          const ultimoRegistroOtp = filtroOtp[filtroOtp.length - 1];
          return ultimoRegistroOtp;
        case EstadoSolicitud.AprobadaDesembolsada:
          const filtroAprobadas = value.filter(item => item.estado.idEstado === EstadoSolicitud.AprobadaDesembolsada);
          const ultimoRegistroAprobadas = filtroAprobadas[filtroAprobadas.length - 1];
          return ultimoRegistroAprobadas;
        case EstadoSolicitud.Rechazada:
          const filtroRechazada = value.filter(item => item.estado.idEstado === EstadoSolicitud.Rechazada);
          const ultimoRegistroRechazada = filtroRechazada[filtroRechazada.length - 1];
          return ultimoRegistroRechazada;
        case EstadoSolicitud.Devuelta:
          const filtroDevuelta = value.filter(item => item.estado.idEstado === EstadoSolicitud.Devuelta);
          const ultimoRegistroDevuelta = filtroDevuelta[filtroDevuelta.length - 1];
          return ultimoRegistroDevuelta;

        default: return 'sin datos';
      }
    }
    return null;
  }
}
