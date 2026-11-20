export class Configuracion {
  intentosOTP: number;
  registrosPorPagina: number;
  montoMinimo: number;
  montoMaximo: number;
  montoMaxAprobacionGrte: number;
  plazoMaxAprobacionGrte: number;
  montoMaxAprobacionGrteReg: number;
  plazoMaxAprobacionGrteReg: number;
  tiempoOTP: number;
  causalDevolucion: { id: string; tipo: number; motivo: string; }[];
  causalRechazo: { id: string; tipo: number; motivo: string; }[];
  permisosEjecucion: {
    id: number;
    menu: string;
    modulos: { id: number; modulo: string; acciones: { id: number; accion: string; }[] }[];
  }[];
  informes: { titulo: string; url: string; }[];
}
