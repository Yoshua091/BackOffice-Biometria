export interface AuthCredentials {
  usuario: number;
  clave: string;
}

export enum Roles {
  ASESOR = 1,
  ASISTENTE = 2,
  GERENTE = 3,
  COMITE = 4,
  ADMIN = 5,
  OPERACIONES = 6,
  CONSULTA = 9,
  COORDINADOCREDITO = 13
}

export enum TiposReferencias {
  ARRIENDO_VIVIENDA = 1,
  ARRIENDO_LOCAL,
  LABORAL
}

export enum TiposMiembro {
  LIDER = 1,
  MIEMBRO,
  CLIENTE_EXPERTO,
  CODEUDOR_ASALARIADO,
  CODEUDOR_INDEPENDIENTE,
  LIDER_GARANTIA
}

export enum TipoSolicitud {
  INDEFINIDA,
  CLIENTE_EXPERTO,
  INDIVIDUAL,
  GRUPAL,
  INDIVIDUAL_CON_GARANTIA
}

export enum TiposCampos {
  text,
  number,
  select,
  date,
}

export enum TipoValidaciones {
  email,
  currency,
  cellphone,
  identificationNumber,
  maxLength,
  minLength,
  alphanumeric,
  maxLengthFifty,
}

export enum EstadoCredito {
  SIN_ACUERDO = 1,
  CON_ACUERDO,
  ACUERDO_VENCIDO,
}

export enum RangosNotificaciones {
  PRIMERA_NOTIFICACION = 1,
  SEGUNDA_NOTIFICACION,
  TERCERA_NOTIFICACION,
}

export enum ProcesadoLoteRenovacion {
  PROCESANDO,
  PROCESADO,
  EXCLUIDO
}


export enum PermisosComponentes {
  PROPUESTAS = 1,
  DASHBOARD = 2,
  COBRANZAS = 3,
  RENOVACION = 4,
  REPORTES = 5,
  RESUMEN = 6,
  SUCURSALES = 7,
  EMPLEADOS = 8,
  METAS = 9


}
