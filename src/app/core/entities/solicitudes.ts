import { Empleado } from './empleado';
import { Sucursal } from './sucursal';
import { Referencias } from './referencias';
import { LoteRenovacionRegistro } from './lote-renovacion';
import { MotivoRechazoDevolucion } from './motivo-rechazo-devolucion';
import { ComiteInterface } from './comite.interface';
import { Tipo } from './solicitudes-soporte';

// TODO: cambiar por enumerador los que son estados

// tslint:disable
export class Solicitudes {
  _id: string;
  _rev: string;
  fechaRecepcion: string;
  cartera: { cartera: Cartera[] };
  idSolicitud: string;
  estado: number;
  comite: ComiteInterface;
  secuencia: number;
  createdAt: string;
  updatedAt: string;
  miembros: Cliente[];
  usuarioRegistra: Empleado;
  sucursal: Sucursal;
  logEstados: LogEstados[];
  simulacion: Simulacion;
  fotos: Foto[];
  chat: Comentario[];
  updatedAtconsole: string;
  renovacion: LoteRenovacionRegistro;
  motivoRechazoDevolucion: MotivoRechazoDevolucion[];
  rechaza: any;
  siif: any;
  fechaEstados
  tipoSolicitud: Tipo;
  fechaCreacionSolicitud = new Date();
  altair: Altair;
  log: Log[];
  soporte: Soporte;
  motor: any;
}

export class Cliente {
  tipoMiembro: {
    id: number;
    tipo: string;
    soat: boolean;
  };
  datosPersonalesCliente: DatosPersonales;
  datosIdentificacionCliente: Identificacion;
  datosCodeudor: {
    parentescoConTitular: {
      id: number;
      parentesco: string;
    }
  };
  datosConyugue: {
    nombres: string;
    apellidos: string;
    genero: string;
    tipoIdentificacion: {
      id: number;
      detalle: string;
      tipo: string;
    };
    numeroIdentificacion: string;
    telefono: string;
    ocupacion: {
      id: number;
      ocupacion: string;
    };
    empresaDondeTrabaja: string;
    direccionEmpresa: string;
    pais: {
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string;
    };
    departamento: {
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string;
      divipolad: string;
      departamento: string;
    };
    ciudad: {
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string;
      divipolad: string;
      departamento: string;
      divipolam: string;
      municipio: string;
    };
    ingresoMensual: number;
  };
  datosContactoCliente: DatosContacto;
  datosCoodeudorAsalariado: DatosAsalariado;
  referenciasCliente: {
    buenVecino: boolean;
    tiempoFuncionando: number;
    nombreDueno: string;
    nombreReferenciaZonal: string;
    telefono: string;
    nombreArrendador: string;
    telefonoArrendador: string;
    nombreArrendadorLocal: string;
    telefonoArrendadorLocal: string;
  };
  datosComerciales: DatosComerciales;
  encuestaSocioEconomica: EncuestaSocioEconomica;
  solicitudEconomica: {
    valoresDetalles: {
      monto: number;
      plazoMeses: {
        idPlazo: number;
        meses: number;
      };
      destinoPrestamo: {
        idDestino: number;
        destino: string;
      };
      DetalleDestinoCredito: string;
      tipoProducto: {
        idTipo: number;
        tipo: string;
      };
      tipoGarantia: {
        idGarantia: number;
        garantia: string;
      };
      diaPago: {
        idDia: number;
        dia: number;
      };
      montoAnterior: number;
      plazoAnterior: {
        idPlazo: number;
        meses: number;
      };
      historialCambio: any[];
    }
  };
  fotos: any;
  otp: OTP;
  declaracionFondos: {
    texto: string;
    comentariosAdicionales: string;
  };
  desembolso: Desembolso;
  seguro: Seguro[];
  aprobacion: ClienteAprobacion;
  preguntas: Referencias[];
}

class DatosPersonales {
  nombre1: string;
  nombre2: string;
  apellido1: string;
  apellido2: string;
  fechaNacimiento: string;
  genero: { id: number; genero: string };
  nivelEducativo: {
    id: number;
    nivel: string;
  };
  tipoDeVivienda: {
    id: number;
    tipoVivienda: string;
  };
  tiempoEnVivienda: number;
  estadoCivil: {
    id: number;
    estadoCivil: string;
  };
  tipoDeLocal: {
    id: number;
    local: string;
  };
  manejaRecursosPublicos: boolean;
  personaPoliticaExpuesta: boolean;
  operacionesEnMonedaExt: boolean;
  tipoOperacionImportacion: {
    id: number;
    tipo: string;
  };
  hijosMenores: boolean;
  numeroHijosMenores: number;
  personasACargo: boolean;
  programaReincorporacion: boolean;
  numeroResolucion: string;
  fechaResolucion: string;
  numeroPersonasACargo: number;
}

export class Identificacion {
  tipoIdentificacion: TipoIdentificacion;
  numeroIdentificacion: string;
  fechaExpedicion: string;
  lugarExpedicionIdentificacion: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam: string;
    municipio: string;
  };
  paisNacimiento: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
  };
  ciudadNacimiento: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam: string;
    municipio: string;
  };
  ciudadExpedicion: {
    odigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam: string;
    municipio: string;
  };
}

class TipoIdentificacion {
  id: number;
  detalle: string;
  tipo: string;
}

class Comite {

}

class DatosComerciales {
  nombreEstablecimiento: string;
  telefonoComercial: string;
  CIIUSector: {
    seccion: string;
    descripcionSector: string;
    macroSector: string;
    descripcionMacroSector: string;
  };
  CIIUSubSector: CIIUSubsector;
  negocioEnVivienda: boolean;
  ambulante: boolean;
  ambulanteConUbicacionFIja: boolean;
  location: {
    lon: number;
    lat: number;
  };
  pais: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
  };
  departamento: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
  };
  ciudad: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam: string;
    municipio: string;
  };
  barrio: string;
  direccion: string;
  indicaciones: string;
  numeroEmpleados: number;
  tiempoExpDesarrollandoActividad: number;
  tiempoEnLugarActual: number;
}

export class CIIUSubsector {
  seccion: string;
  descripcionSector: string;
  macroSector: string;
  descripcionMacroSector: string;
  subSector: string;
  descripcionSubSector: string;
  actividad: string;
  descripcionActividad: string;
  descripcionSeccion: string;
  limiteMinimo: string;
  limiteMaximo: string;
  tipoNegocio: string;
}

class DatosContacto {
  telefono: string;
  telefono1: string;
  email: string;
  direccion: string;
  pais: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
  };
  departamento: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
  };
  ciudad: {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam: string;
    municipio: string;
  };
  barrio: string;
  indicaciones: string;
  location: {
    lon: number;
    lat: number;
  };
  estrato: {
    id: number;
    estrato: number;
  };
}

class EncuestaSocioEconomica {
  tipoNegocio: string;
  montoVentas: MontoVentas;
  margenVentasBruto: number;
  gastosMicroEmpresa: {
    salariosYManoObra: number;
    transporte: number;
    arriendo: number;
    servicios: number;
    cuotasDeCredito: number;
    obligacionesConSectorFinanciero: number;
    otrosGastos: number;
  };
  ingresosDelCliente: {
    otrosIngresos: {
      id: number;
      ingreso: string;
    };
    monto: number;
  };
  gastosDelCliente: {
    alimentacion: number;
    arriendo: number;
    transporte: number;
    servicios: number;
    educacion: number;
    salud: number;
    otrosGastos: number;
    deudasTerceros: number;
  };
  activo: {
    efectivoBancos: number;
    cuentasPorCobrar: number;
    inventarios: number;
    inmuebles: number;
    activosFijos: number;
    vehiculos: number;
  };
  pasivo: {
    deudasConProspera: number;
    deudasSectorFinanciero: number;
    proveedores: number;
    anticipoClientes: number;
    saldoHipoteca: number;
    deudasTerceros: number;
    deudasInstitucion: number;
  };
  costoDeVentas: number;
}

export class MontoVentas {
  ventasMensualPromedio: number;
  registroDeVentas: RegistroDeVentas;
  diasBuenosMalos: DiasBuenosMalos;
  ventasPorPeriodo: VentasPorPeriodo;
  relacionComprasProveedores: RelacionComprasProveedores;
}

export class RegistroDeVentas {
  tieneRegistro: true;
  semanaAnterior: {
    lunes: number;
    martes: number;
    miercoles: number;
    jueves: number;
    viernes: number;
    sabado: number;
    domingo: number;
  };
  semanaActual: {
    lunes: number;
    martes: number;
    miercoles: number;
    jueves: number;
    viernes: number;
    sabado: number;
    domingo: number;
  };
}

export class DiasBuenosMalos {
  numeroDiasBuenos: number;
  ventasEnUnDiaBueno: number;
  numeroDiasRegulares: number;
  ventasEnUnDiaRegular: number;
  numeroDiasMalos: number;
  ventasEnUnDiaMalo: number;
}

export class VentasPorPeriodo {
  ventas: number;
  periodicidadVentasPeriodo: {
    id: number;
    periodo: string;
  };
}

export class RelacionComprasProveedores {
  vecesAlMesProveedor1: number;
  valorPromCompraProveedor1: number;
  vecesAlMesProveedor2: number;
  valorPromCompraProveedor2: number;
  vecesAlMesProveedor3: number;
  valorPromCompraProveedor3: number;
}

class Desembolso {
  tipoDesembolso: {
    id: number;
    tipo: string;
  };
  banco: {
    id: number;
    banco: string;
    codigo: string;
  };
  tipoCuenta: {
    id: number;
    tipo: string;
  };
  numeroCuenta: string;
  seguroSoat: any;
}

class Seguro {
  nombre: string;
  valorMensual: number;
  detalles: { clave: string; valor: number; }[];
  aprobado: boolean;
  beneficiarios: {
    nombre: string;
    documentoIdentidad: string;
    parentesco: string;
    porcentaje: string;
  }[];
  otp: any;
  cf: any;
}

class DatosAsalariado {
  informacionLaboral: {
    pais: {
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string
    };
    departamento: {
      id: number;
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string;
      divipolad: string;
      departamento: string
    };
    ciudad: {
      codigoContinente: string;
      continente: string;
      codigoPais: string;
      pais: string;
      divipolad: string;
      departamento: string;
      divipolam: string;
      municipio: string
    };
    telefono: number;
    antiguedad: number;
    direccion: string;
    barrio: string;
    nombreEmpresa: string;
    nombreJefe: string;
    cargo: string;
    tipoContrato: {
      id: number;
      tipo: string
    }
  };
  encuestaSocioEconomica: {
    ingresosDelCliente: {
      otrosIngresos: {
        id: number;
        fuente: string
      };
      monto: number;
      sueldo: number;
    };
    gastosDelCliente: {
      alimentacion: number;
      arriendo: number;
      transporte: number;
      servicios: number;
      educacion: number;
      deudasTerceros: number;
      salud: number;
      otrosGastos: number;
    };
    activo: {
      efectivoBancos: number;
      cuentasPorCobrar: number;
      inmuebles: number;
      activosHogar: number;
    };
    pasivo: {
      saldoHipoteca: number;
      deudasTerceros: number;
      deudasSectorFinanciero: number;
      deudasConProspera: number
    }
  };
  tipoContrato: {
    id: number;
    tipo: string
  };
}

/**
 * {
      id: 1  ;
      Nombreid: '300-398-209001fotoCliente1'  ;
      nombre: 'fotoCliente1'  ;
      extension: 'image/png'  ;
      orientacion: 1  ;
      ruta: './local/public/prospera/images'  ;
      tooltip: 'descripción de como debe quedar la imagen en cuanto a calidad  ; orientación etc'  ;
      aprobada: 0  ;
      mensajeRechazo: 'Solo si la imagen es rechazada este campo es obligatorio'
    }
 */
export class Foto {
  id: number;
  Nombreid: string;
  nombre: string;
  extension: string;
  orientacion: number;
  keyNombre: string;
  ruta: string;
  tooltip: string;
  aprobada: number;
  mensajeRechazo: string;
  latitud?: string;
  logintud?: string;
}

class Comentario {
  mensaje: string;
  fechaCreacion: string;
  envia: {
    _idUsuario: string;
    nombre: string;
    apellido: string;
  };
}

export class ClienteAprobacion {
  fotos: boolean;
  firmas: boolean;
  seguros: boolean;
  historial: boolean;
  referenciasArriendoLocal: boolean;
  referenciasArriendoVivienda: boolean;
  aprobacionReferenciasLaborales: boolean;
  clienteExperto: boolean;
  preguntasOTP: boolean;
}

export class OTP {
  intentos: number;
  validadoOtp: string | boolean;
  intentosOtp: IntentoOTP[];
  comprobacion: boolean | string;
  resultado: boolean | string;
  validadoGerente: boolean;
  resultadoPreguntas: {
    resultado: string | boolean;
    aprobacion: string | boolean;
    preguntasCompletas: string | boolean;
    score: string;
    codigoSeguridad: string;
    idCuestionario: string;
    regCuestionario: string;
    aprobado100PorCientoOK: string | boolean;
  };
}

export class IntentoOTP {
  regValidacion: string;
  resultadoOTP: boolean | string;
  idTransaccionOTP: string;
  codResultadoOTP: string;
  mensaje: string;
  fecha: string;
  generar: {
    codParametrizacion: string;
    fechaEquipo: string;
    ResultadoValidacion: {
      numeroValido: boolean | string;
      rankingReconocer: string;
    },
    ResultadoGeneracion: {
      requiereCuestionario: boolean | string;
      timestampOTP: string;
      codResultadoOTP: string;
      idTransaccionOTP: string;
      resultadoOTP: boolean | string;
    },
    DatosCuestionario: {
      procesoEvidente: string;
    },
    mensaje: string;
  };
  verificar: {
    resultadoValidacion: string;
    codParametrizacion: string;
    mensajeValidacion: string;
    codigoValido: boolean;
  };
  preguntas: {
    id: string;
    resultado: string;
    registro: string;
    excluirCliente: string | boolean;
    alertas: string | boolean;
    respuestaAlerta: string;
    codigoAlerta: string;
    Pregunta: {
      id: string;
      texto: string;
      orden: string;
      idRespuestaCorrecta: string;
      peso: string;
      Respuesta: {
        id: string;
        texto: string;
      }[];
    }[];
    mensaje: string;
  };
  respuestas: any[];
}

export class Cartera {
  // tslint:disable-next-line:variable-name
  _id: string;
  sincApitoApp: number;
  sincApptoApi: number;
  simd1: number;
  simd2: number;
  simd3: number;
  fechaActualizacion: string;
  saldo: number;
  gestion: {
    fecha: string;
    usuario: {
      nombre: string;
      apellido: string;
      _id: string;
    },
    comentario: string;
  }[];
  diasEnMora: number;
  estadoCobro: number;
  historial: {
    _id: string;
    evento: string;
    fecha: string;
  }[];
  cuotas: CarteraCuotas[];
  sinc: number;
  totalDeuda: number;
  acuerdos: Acuerdo[];
  createdAt: string;
  updatedAt: string;
}

export class CarteraCuotas {
  fecha: string;
  valor: number;
  timestamp: number | string;
}

export class Acuerdo {
  _id: string;
  _rev: string;
  estado: number;
  gestionado: boolean;
  firma: string;
  comentarios: {
    _id: string;
    comentario: string;
    fecha: string;
    usuario: {
      _id: string;
      nombre: string;
      apellido: string;
    }
  }[];
  fechaAcuerdo: string;
  createdAt: string;
  cedula: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    rol: {
      id: number;
    }
  };
  identificacionCliente: number;
  motivoMora: {
    id: number;
    motivo: string;
  };
  firmaAcuerdo: any;
  motivo: string;
  secuencia: number;
  rango: {
    desde: number;
    hasta: number;
  };
}

export class LogEstados {
  estado: {
    estado: string;
    idEstado: number;
  };
  fecha: string;
  usuario: {
    apellido: string;
    nombre: string;
    usuario_id: string;
    rol:string
  };
}

export class Simulacion {
  error: null;
  simulacion: {
    montoSolicitado: number;
    montoPrestado: string | number;
    cuota: string | number;
    pagos: {
      fechaPago: string;
      saldoInicial: string | number;
      abonoCapital: string | number;
      intereses: string | number;
      cuota: string | number;
      saldoFinal: number;
    }[];
    cargosFijos: {
      codigo: number;
      monto: string | number;
      descripcion: string;
    }[];
    diaDesembolso: string | number;
    diaDePago: string | number;
    tipoCredito: {
      NUMERODELPLANDEINTERES: number;
      TIPODENEGOCIO: number;
      tipo: string;
    };
    fechaDesembolso: string;
    fechaPago: string;
    mipyme: string | number;
    plazo: number;
    iva: string | number;
    centralesRiesgo: string | number;
    seguroVidaDeudores: string | number;
    segurosVoluntarios: string | number;
    canalDesembolso: string | number;
    v4x1000: string | number;
    p4x1000: string | number;
    tasa: number;
    cuotasMiembros: {
      financiacion: string | number;
      porcentajeParticipacion: string | number;
      identificacion: number;
      nombre: string;
      cuotaMensual: string | number;
    }[];
  };
}

export class fechaEstados {
  estado: string
}

export class Altair {
  referencia: string;
  motivoRechazo: any[];
}

export class Log {
  evento: string;
  fecha: string;
  mostrar: any;
}

export class Soporte {
  createdAt: string;
  soporte: boolean;
}
