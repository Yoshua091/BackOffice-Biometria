import {AbstractControl, Validators} from '@angular/forms';
import {EstadoSolicitud} from './pipes/estado-solicitud.pipe';
import {TiposCampos, TiposMiembro} from './types';
import {Cliente} from './entities/solicitudes';

export const avoidTypeText = (control: AbstractControl) =>
  control.valueChanges.subscribe(value => {
    if (value && isNaN(Number(value))) {
      control.setValue(value.substring(0, value.length - 1));
    }
  });

export const arrayBufferToBase64 = (buffer: Iterable<number>): any => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
};

export const blobToBase64 = (blob: Blob): Promise<any> => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

export const MOTIVOS_MORA = [
  {
    id: 1,
    motivo: 'Ventas bajas'
  },
  {
    id: 2,
    motivo: 'Calamidad familiar'
  },
  {
    id: 3,
    motivo: 'Ilocalizado'
  },
  {
    id: 4,
    motivo: 'Sin voluntad de pago'
  },
  {
    id: 5,
    motivo: 'Sobreendeudamiento'
  },
  {
    id: 6,
    motivo: 'Cambio de actividad económica'
  },
  {
    id: 7,
    motivo: 'Inconformidad condiciones de crédito'
  }
];

export const RANGOS_CARTERA = [
  {id: 1, desde: 1, hasta: 7, nombre: 'Acuerdo verbal', crearAcuerdo: false},
  {id: 2, desde: 8, hasta: 19, nombre: 'Primera notificación', crearAcuerdo: true},
  {id: 3, desde: 20, hasta: 34, nombre: 'Segunda notificación', crearAcuerdo: true},
  {id: 4, desde: 35, hasta: 120, nombre: 'Tercera notificación', crearAcuerdo: true},
];

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'access_token',
  SUCURSALES: 'sucursales',
  ROLES: 'roles',
  PERFILES: 'perfiles',
  CONFIG: 'config',
  CONFIG2: 'config2',
  PERMISOS: 'permisos',
  COMITE: 'comite',
  LISTADOTASAS: 'listadoTasas',
  LISTADOCOMISIONES: 'listadoComisiones',
  MOTOR: 'motor'
};

export type FORM_MODE = 'editar' | 'crear';

export const REGEX = {
  EMAIL: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  EMAIL_LIST: /^([\w+-.%]+@[\w-.]+\.[A-z]{2,4},?)+$/,
  NUMERIC: /^[0-9]+$/,
  CELLPHONE: /^(\+)?[0-9]+( [0-9]+)*$/,
  CURRENCY: /^[0-9,.]+$/,
  ALPHANUMERIC: /^[ 0-9A-z]+$/,
  ALPHABETICAL: /^([ \u00c0-\u01ffa-zA-Z'\-])+$/,
  IDENTIFICATION_NUMBER: /^\d*(\.\d+)?$/

};

export const CODIGOS_RESP = [
  '02DATPP200-S00001', // plazos/buscar
  '02DATPP200-S00002', // plazos/buscar

  '02METBU200-S00001', // metas/buscar
  '02METBU200-S00002', // metas/buscar

  '02PERBU200-S00001', // perfiles/buscar
  '02PERBU200-S00002', // perfiles/buscar

  '02REFBU200-S00001', // referencias/buscar
  '02REFBU200-S00002', // referencias/buscar

  '02ROLBU200-S00001', // roles/buscar
  '02ROLBU200-S00002', // roles/buscar

  '02SOLBUASE200-S00001', // solicitudes/buscar/asesor
  '02SOLBUASE200-S00002', // solicitudes/buscar/asesor
  '02SOLBUID200-S00001', // solicitudes/buscar/id
  '02SOLBUID200-S00002', // solicitudes/buscar/id
  '02SOLBUNC200-S00001', // solicitudes/buscar/nombreCedula
  '02SOLBUNC200-S00002', // solicitudes/buscar/nombreCedula,
  '02SOLBUEST200-S00001', // solicitudes/buscar/estado
  '02SOLBUEST200-S00002', // solicitudes/buscar/estado
  '200-S05001', // solicitudes/contar/por/estado
  '200-S05002', // solicitudes/contar/por/estado
  '02SOLOBID200-S00001', // solicitudes/buscar/id
  '02SOLOBID200-S00002', // solicitudes/buscar/id

  '02SUCBUS200-S00001', // sucursales/buscar
  '02SUCBUS200-S00002', // sucursales/buscar

  '02USUBUS200-S00001', // usuarios/buscar
  '02USUBUS200-S00002', // usuarios/buscar

  '02USUBUSSUCASE200-S00001', // asesores/buscar
  '02UBUSSUCASE200-S00002', // asesores/buscar
  '02USUBUSSUC200-S00001', // asesores/buscarPorSucursal
  '02USUBUSSUC200-S00002', // asesores/buscarPorSucursal

  '40-AS001310-200', //Buscar tranferencias

];

export const EstadoOTP = {
  APROBADO: '1',
  NO_APROBADO: '2',
  NO_APROBADO_POR_RECONOCER: '3',
  SIN_RESPUESTA: '4',
  ERROR_VALIDACION: '5',
  EXPIRADO: '6',
  TRANSACCION_INVALIDA_INTENTO_ADICIONAL: '7',
  TRANSACCION_INVALIDA_VERIFICACION_ADICIONAL: '8',
  ERROR_GENERANDO_CODIGO: '99',
};

// TODO: implementar campos que estan en excel y serán editables
export const CamposEditables = {
  fechaNacimiento: {
    ruta: 'datosPersonalesCliente.fechaNacimiento',
    label: 'Fecha de nacimiento',
    tipo: TiposCampos.date,
    validadores: [Validators.required],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  genero: {
    ruta: 'datosPersonalesCliente.genero',
    label: 'Género',
    tipo: TiposCampos.select,
    validadores: [Validators.required],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado),
    opciones: {
      etiqueta: 'genero',
      listado: [
        {id: 1, genero: 'Masculino'},
        {id: 2, genero: 'Femenino'}
      ]
    }
  },
  nivelEducativo: {
    ruta: 'datosPersonalesCliente.nivelEducativo',
    label: 'Nivel educativo',
    tipo: TiposCampos.select,
    validadores: [Validators.required],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado),
    opciones: {
      etiqueta: 'nivel',
      listado:  [
        {id: 1, nivel: 'Ninguno'},
        {id: 2, nivel: 'Primaria'},
        {id: 3, nivel: 'Secundaria'},
        {id: 4, nivel: 'Universitario'}
      ]
    }
  },
  ciudadNacimiento: {
    ruta: 'datosIdentificacionCliente.ciudadNacimiento.departamento',
    label: 'Lugar de nacimiento',
    tipo: TiposCampos.text,
    validaciones: {},
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  numeroIdentificacionConyuge: {
    ruta: 'datosConyugue.numeroIdentificacion',
    label: 'Identificación',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.IDENTIFICATION_NUMBER.test(control.value) ?
          { pattern: 'Por favor ingresa un número de identificación válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  fechaExpedicionDocumento: {
    ruta: 'datosIdentificacionCliente.fechaExpedicion',
    label: 'Fecha de expedición',
    tipo: TiposCampos.date,
    validadores: [Validators.required],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  ciudadExpedicion: {
    ruta: 'datosIdentificacionCliente.ciudadExpedicion.municipio',
    label: 'Lugar de expedición',
    tipo: TiposCampos.text,
    validaciones: {},
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  nombresConyuge: {
    ruta: 'datosConyugue.nombres',
    label: 'Nombre del cónyuge',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  apellidosConyuge: {
    ruta: 'datosConyugue.apellidos',
    label: 'Apellido del cónyuge',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  indicaciones: {
    ruta: 'datosContactoCliente.indicaciones',
    label: 'Indicaciones para llegar',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  estrato: {
    ruta: 'datosContactoCliente.estrato',
    label: 'Estrato',
    tipo: TiposCampos.select,
    validadores: [Validators.required],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado),
    opciones: {
      etiqueta: 'estrato',
      listado: [
        {id : 1, estrato : 1},
        {id : 2, estrato : 2},
        {id : 3, estrato : 3},
        {id : 4, estrato : 4},
        {id : 5, estrato : 5},
        {id : 6, estrato : 6}
      ]
    }
  },
  telefonoComercial: {
    ruta: 'datosComerciales.telefonoComercial',
    label: 'Teléfono',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  nombreArrendador: {
    ruta: 'referenciasCliente.nombreArrendador',
    label: 'Nombre de referecia',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  personasACargo: {
    ruta: 'datosPersonalesCliente.personasACargo',
    tipo: TiposCampos.number,
    validaciones: {},
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  numeroHijosMenores: {
    ruta: 'datosPersonalesCliente.numeroHijosMenores',
    label: 'Hijos menores de edad',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(2),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  tiempoEnVivienda: {
    ruta: 'datosPersonalesCliente.tiempoEnVivienda',
    label: 'Tiempo en la vivienda',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },

  conyugeTelefono: {
    ruta: 'datosConyugue.telefono',
    label: 'Teléfono',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  telefono: {
    ruta: 'datosContactoCliente.telefono',
    label: 'Teléfono',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  telefono1: {
    ruta: 'datosContactoCliente.telefono1',
    label: 'Teléfono 2',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  email: {
    ruta: 'datosContactoCliente.email',
    label: 'Email',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.EMAIL.test(control.value) ? { pattern: 'Por favor ingresa una dirección de email valida. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  direccionCliente: {
    ruta: 'datosContactoCliente.direccion',
    label: 'Dirección',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHANUMERIC.test(control.value) ? { pattern: 'Por favor ingresa una dirección valida. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  barrio: {
    ruta: 'datosContactoCliente.barrio',
    label: 'Barrio',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  telefonoArrendador: {
    ruta: 'referenciasCliente.telefonoArrendador',
    label: 'Teléfono de referencia',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  nombreArrendadorLocal: {
    ruta: 'referenciasCliente.nombreArrendadorLocal',
    label: 'Nombre de referecia',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  telefonoArrendadorLocal: {
    ruta: 'referenciasCliente.telefonoArrendadorLocal',
    label: 'Teléfono de referencia',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  direccion: {
    ruta: 'datosComerciales.direccion',
    label: 'Dirección de la microempresa',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  tiempoExpDesarrollandoActividad: {
    ruta: 'datosComerciales.tiempoExpDesarrollandoActividad',
    label: 'Tiempo operando',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  tiempoEnLugarActual: {
    ruta: 'datosComerciales.tiempoEnLugarActual',
    label: 'Tiempo en el lugar actual',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(3),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  salariosYManoObra: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.salariosYManoObra',
    label: 'Salarios y mano de obra',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  transporte: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.transporte',
    label: 'Transporte',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  arriendo: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.arriendo',
    label: 'Arriendo',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  servicios: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.servicios',
    label: 'Servicios',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  cuotasDeCredito: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.cuotasDeCredito',
    label: 'Cuotas de créditos (terceros)',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  otrosGastos: {
    ruta: 'encuestaSocioEconomica.gastosMicroEmpresa.otrosGastos',
    label: 'Otros gastos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  alimentacion: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.alimentacion',
    label: 'Alimentación',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  arriendoCliente: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.arriendo',
    label: 'Arriendo',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  serviciosCliente: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.servicios',
    label: 'Servicios',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  transporteCliente: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.transporte',
    label: 'Transporte',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  salud: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.salud',
    label: 'Salud',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  educacion: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.educacion',
    label: 'Educación',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  deudasTerceros: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.deudasTerceros',
    label: 'Deudas con terceros',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  otrosGastosCliente: {
    ruta: 'encuestaSocioEconomica.gastosDelCliente.otrosGastos',
    label: 'Otros gastos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  efectivoBancos: {
    ruta: 'encuestaSocioEconomica.activo.efectivoBancos',
    label: 'Efectivo y bancos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  cuentasPorCobrar: {
    ruta: 'encuestaSocioEconomica.activo.cuentasPorCobrar',
    label: 'Cuentas por cobrar',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  inventarios: {
    ruta: 'encuestaSocioEconomica.activo.inventarios',
    label: 'Inventarios',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  inmuebles: {
    ruta: 'encuestaSocioEconomica.activo.inmuebles',
    label: 'Inmuebles',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  activosFijos: {
    ruta: 'encuestaSocioEconomica.activo.activosFijos',
    label: 'Activos fijos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  vehiculos: {
    ruta: 'encuestaSocioEconomica.activo.vehiculos',
    label: 'Vehículos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  proveedores: {
    ruta: 'encuestaSocioEconomica.pasivo.proveedores',
    label: 'Proveedores',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  anticipoClientes: {
    ruta: 'encuestaSocioEconomica.pasivo.anticipoClientes',
    label: 'Anticipo de clientes',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  saldoHipoteca: {
    ruta: 'encuestaSocioEconomica.pasivo.saldoHipoteca',
    label: 'Saldo hipoteca',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  deudasTercerosPasivos: {
    ruta: 'encuestaSocioEconomica.pasivo.deudasTerceros',
    label: 'Deudas con terceros o familiares',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  alimentacionCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.alimentacion',
    label: 'Alimentación',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  arriendoCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.arriendo',
    label: 'Arriendo',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  serviciosCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.servicios',
    label: 'Servicios',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  transporteCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.transporte',
    label: 'Transporte',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  saludCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.salud',
    label: 'Salud',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  educacionCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.educacion',
    label: 'Educación',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  deudasTercerosGastosCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.deudasTerceros',
    label: 'Deudas terceros',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  otrosGastosCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.gastosDelCliente.otrosGastos',
    label: 'Otros gastos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  efectivoBancosCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.activo.efectivoBancos',
    label: 'Efectivo y bancos',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  cuentasPorCobrarCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.activo.cuentasPorCobrar',
    label: 'Cuentas por cobrar',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  activosHogarCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.activo.activosHogar',
    label: 'Activos del hogar',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  inmueblesCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.activo.inmuebles',
    label: 'Inmuebles',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  saldoHipotecaCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.pasivo.saldoHipoteca',
    label: 'Saldo hipoteca',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  deudasTercerosCodeudorAsalariado: {
    ruta: 'datosCoodeudorAsalariado.encuestaSocioEconomica.pasivo.deudasTerceros',
    label: 'Deudas con terceros',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.maxLength(9),
      (control: AbstractControl) => {
        return !REGEX.NUMERIC.test(control.value) ? { pattern: 'Por favor ingresa solo números. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  nombreEmpresaLaboral: {
    ruta: 'datosCoodeudorAsalariado.informacionLaboral.nombreEmpresa',
    label: 'Nombre de empresa',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  cargoLaboral: {
    ruta: 'datosCoodeudorAsalariado.informacionLaboral.cargo',
    label: 'Cargo',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  telefonoLaboral: {
    ruta: 'datosCoodeudorAsalariado.informacionLaboral.telefono',
    label: 'Teléfono',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      Validators.minLength(7),
      Validators.maxLength(10),
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  antiguedadLaboral: {
    ruta: 'datosCoodeudorAsalariado.informacionLaboral.antiguedad',
    label: 'Antigüedad',
    tipo: TiposCampos.number,
    validadores: [
      Validators.required,
      (control: AbstractControl) => {
        return !REGEX.CELLPHONE.test(control.value) ? { pattern: 'Por favor ingresa un número válido. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
  barrioLaboral: {
    ruta: 'datosCoodeudorAsalariado.informacionLaboral.barrio',
    label: 'Barrio',
    tipo: TiposCampos.text,
    validadores: [
      Validators.required,
      Validators.maxLength(50),
      (control: AbstractControl) => {
        return !REGEX.ALPHABETICAL.test(control.value) ? { pattern: 'Por favor ingresa solo letras. ' } : null;
      }
    ],
    editable: (res, resEstado) => [EstadoSolicitud.ValidacionAsistente, EstadoSolicitud.ValidacionGerente, EstadoSolicitud.AprobadaDesembolsada].includes(resEstado.estado)
  },
};

export const CamposEditablesDesembolso = {
  
}


/**
 * {
 *   Incompleta = 1,
 *   Cancelada = 5,
 *   Devuelta = 10,
 *   Creada = 20,
 *   Sincronizada = 40,
 *   ValidacionAsistente = 45,
 *   ValidacionGerente = 50,
 *   Comite = 55,
 *   ValidacionIdentidad = 60,
 *   Rechazada = 65,
 *   LegalizandoCredito = 70,
 *   ErrorCreacionCredito = 71,
 *   AsociandoCodeudores = 74,
 *   GenerandoDesembolso = 75,
 *   ErrorAsociarCodeudores = 76,
 *   DesembolsoConfirmado = 80,
 *   DesembolsoFallido = 81,
 *   AsociacionCodeudoresFallida = 82,
 *   AprobadaDesembolsada = 100,
 * }
 */
export const EstadosSolicitudString = {
  1: 'Incompleta',
  5: 'Cancelada',
  7: 'Nueva renovación',
  8: 'Renovación cancelada',
  10: 'Devuelta',
  20: 'Creada',
  35: 'Anulada',
  40: 'Sincronizada',
  45: 'Validación',
  50: 'Aprobación',
  55: 'Comité',
  60: 'OTP',
  62: 'Alta de clientes (Definir Garantía)',
  63: 'Alta de clientes (En garantía FNG)',
  64: 'Alta de clientes (FNG casos especiales)',
  65: 'Rechazada',
  66: 'Alta de clientes',
  67: 'Error validación Altair',
  70: 'Creando crédito',
  71: 'Legalizando crédito',
  73: 'Anulada por core',
  74: 'Verificando codeudores',
  75: 'Verificando desembolso',
  76: 'Registrando codeudores',
  80: 'Desembolso confirmado',
  81: 'Desembolso fallido',
  82: 'Verificando codeudores',
  90: 'Dispersión inicial ',
  95: 'Dispersión en proceso',
  100: 'Aprobada',
  120: 'Dispersión',
  200: 'Finalizada'
};


// Tabla 1 – Tipos de Identificación
export const HCTipoIdentificacion = {
  1: 'CC',
  2: 'NIT',
  3: 'PJE',
  4: 'CE',
  5: 'PAS',
  6: 'CD',
  7: 'TI',
  8: 'DNI',
  9: 'PEP',
};

// Tabla 2 – Estado de documento de identificación
export const HCEstadoDocumento = {
  '00': 'Vigente',
  21: 'Cancelada por muerte o fallecido',
  22: 'Cancelada',
  23: 'Cancelada',
  24: 'Cancelada',
  25: 'Cancelada',
  26: 'Cancelada',
  27: 'Cancelada',
  28: 'Cancelada',
  29: 'Cancelada',
  30: 'No expedida',
  31: 'No expedida',
  32: 'No expedida',
  33: 'No expedida',
  34: 'No expedida',
  35: 'No expedida',
  36: 'No expedida',
  37: 'No expedida',
  38: 'No expedida',
  39: 'No expedida',
  40: 'No expedida',
  41: 'No expedida',
  42: 'No expedida',
  43: 'No expedida',
  44: 'No expedida',
  45: 'No expedida',
  46: 'No expedida',
  47: 'No expedida',
  48: 'No expedida',
  49: 'No expedida',
  50: 'No expedida',
  51: 'No expedida',
  52: 'No expedida',
  53: 'No expedida',
  54: 'No expedida',
  55: 'No expedida',
  56: 'No expedida',
  57: 'No expedida',
  58: 'No expedida',
  59: 'No expedida',
  99: 'En trámite',
};

// Tabla 3 – Tipos de Cuenta
export const HCTiposCuentas = {
  AGR: 'Cartera Agroindustrial',
  AHO: 'Cuentas de ahorro y bancarias',
  ALI: 'Cartera de Alimentos',
  APD: 'Almacén por departamentos',
  CAB: 'Cartera Bancaria',
  CAC: 'Cartera Cooperativas de ahorro y crédito',
  CAU: 'Cartera Automotriz',
  CAV: 'Cartera de Ahorro y Vivienda',
  CBM: 'Créditos Bajo Monto',
  CBR: 'Cartera Bancaria Rotativa',
  CCB: 'Cuentas Corrientes Bancarias',
  CCC: 'Cartera de Crédito de Construcción',
  COF: 'Cartera Corporaciones Financieras',
  COM: 'Cartera Computadores',
  CON: 'Créditos de Consumo',
  CSA: 'Carteras Caja de Compensación y Salud',
  CSP: 'Empresas de Servicios Públicos',
  CTC: 'Cartera de Telefonía Celular',
  CTU: 'Cartera Turismo',
  CVE: 'Cartera Vestuario',
  DIC: 'Departamento de Información Comercial',
  EDU: 'Cartera Educación',
  EST: 'Estatal',
  FER: 'Cartera Ferreterías',
  CCF: 'Cartera Compañías de Financiamiento Comercial',
  CCL: 'Cartera de Compañías de Leasing',
  CCS: 'Cartera Compañías de Seguros',
  CDB: 'Corredores de Bolsa',
  CDC: 'Cartera de Comunicaciones',
  CEL: 'Cartera de Electrodomésticos',
  CFE: 'Cartera Fondo de Empleados',
  CFR: 'Cartera Finca Raíz',
  CLB: 'Cartera Editorial',
  CMU: 'Cartera Muebles',
  CMZ: 'Cartera Comercializadoras',
  COC: 'Cartera Otros Créditos',
  FUN: 'Cartera Fundaciones',
  GRM: 'Cartera Gremios',
  IND: 'Cartera Industrial',
  LAB: 'Cartera Laboratorios',
  LBZ: 'Cartera Libranza',
  MCR: 'Cartera Microcrédito',
  SBG: 'Cartera Sobregiro',
  SEG: 'Cartera Seguridad',
  SFI: 'Servicios Financieros',
  TDC: 'Tarjeta de Crédito',
  TRT: 'Cartera Transporte',
};

// Tabla 4 - estados de pago Tarjeta/Cartera
export const HCEstadoPagoTarjetaCartera = {
  '00': {descripcion: 'No disponible', vigente: true},
  '01': {descripcion: 'Al día', vigente: true},
  '02': {descripcion: 'Tarjeta no entregada', vigente: false},
  '03': {descripcion: 'Cancelada por mal manejo', vigente: false},
  '04': {descripcion: 'Tarjeta robada', vigente: false},
  '05': {descripcion: 'Cancelada vol.', vigente: false},
  '06': {descripcion: 'Cancelada MX', vigente: false},
  '07': {descripcion: 'Tarjeta extraviada', vigente: false},
  '08': {descripcion: 'Pago voluntario', vigente: false},
  '09': {descripcion: 'Pago voluntario', vigente: false},
  10: {descripcion: 'Pago voluntario', vigente: false},
  11: {descripcion: 'Pago voluntario', vigente: false},
  12: {descripcion: 'Pago voluntario', vigente: false},
  13: {descripcion: 'Al día Mora 30', vigente: true},
  14: {descripcion: 'Al día Mora 60', vigente: true},
  15: {descripcion: 'Al día Mora 90', vigente: true},
  16: {descripcion: 'Al día Mora 120', vigente: true},
  17: {descripcion: 'Está en mora 30', vigente: true},
  18: {descripcion: 'Está en mora 60', vigente: true},
  19: {descripcion: 'Está en mora 90', vigente: true},
  20: {descripcion: 'Está en mora 120', vigente: true},
  21: {descripcion: 'FM60ESTAM30', vigente: true},
  22: {descripcion: 'FM90ESTAM30', vigente: true},
  23: {descripcion: 'FM90ESTAM60', vigente: true},
  24: {descripcion: 'FM120ESTAM30', vigente: true},
  25: {descripcion: 'FM120ESTAM60', vigente: true},
  26: {descripcion: 'FM120ESTAM90', vigente: true},
  27: {descripcion: 'RM30ESTAM60', vigente: true},
  28: {descripcion: 'RM30ESTAM90', vigente: true},
  29: {descripcion: 'RM30ESTAM120', vigente: true},
  30: {descripcion: 'RM60ESTAM30', vigente: true},
  31: {descripcion: 'RM60ESTAM60', vigente: true},
  32: {descripcion: 'RM60ESTAM90', vigente: true},
  33: {descripcion: 'RM60ESTAM120', vigente: true},
  34: {descripcion: 'RM90ESTAM30', vigente: true},
  35: {descripcion: 'RM90ESTAM60', vigente: true},
  36: {descripcion: 'RM90ESTAM90', vigente: true},
  37: {descripcion: 'RM90ESTAM120', vigente: true},
  38: {descripcion: 'RM120ESTAM30', vigente: true},
  39: {descripcion: 'RM120ESTAM60', vigente: true},
  40: {descripcion: 'RM120ESTAM90', vigente: true},
  41: {descripcion: 'RM 120 ESTA M 120', vigente: true},
  45: {descripcion: 'Cartera castigada', vigente: true},
  46: {descripcion: 'Cartera recuperada', vigente: false},
  47: {descripcion: 'Dudoso recaudo', vigente: true},
  49: {descripcion: 'Tarjeta renovada', vigente: false},
  60: {descripcion: 'En reclamación', vigente: true},
};

// Tabla 6 - Codigos de garante
export  const HCCodigosGarante = {
  '00': 'Deudor Principal',
  '01': 'Codeudor',
  '02': 'Codeudor',
  '03': 'Codeudor',
  '04': 'Avalista',
  '05': 'Deudor solidario',
  '06': 'Coarrendatario',
  '07': 'Otros Garantes',
  '08': 'Fiador',
  '09': 'No Aplica',
  96: 'Cotitular',
  97: 'Comunal (Solo para cuentas Microcredito – MCR)',
  98: 'No Aplica',
  99: 'No Aplica',
};

export const HCEstadoCivilGenero = {
  1: 'Casada',
  2: 'Viuda',
  3: 'Mujer',
  4: 'Hombre',
};

export const HCSector = {
  1: 'Financiero',
  2: 'Cooperativo',
  3: 'Real',
  4: 'Telecomunicaciones',
};

// Tabla 11 – Tabla de garantías, hábito de pago obligaciones vigentes
export const HCGarantiaHabitoPagoObligacionesVigentes = {
  0: 'SIN GAR',
  1: 'ADMIS',
  2: 'OTR GAR',
  A: 'NO IDON',
  B: 'BIEN RAICES',
  C: 'OTR PREND',
  D: 'PIGN RENTA',
  E: 'GAR SOBER NACION',
  F: 'CONT IRREV FIDUC',
  G: 'FNG',
  H: 'CARTA CRÉD',
  I: 'FAG',
  J: 'PERSONAL',
  K: 'BIEN LEASI NO INMOB',
  L: 'BIEN LEASI INMOB',
  M: 'PRENDA TITULO',
  N: 'DEPOSITOS',
  O: 'SEG CREDITO',
  P: 'OTRAS GARANTÍAS IDÓNEAS',
  Q: 'NO IDÓNEA',
};

// tabla 14
export const HCCalificacionTCAndCC = {
  0: 'No reporta informacion',
  1: 'A',
  2: 'B',
  3: 'C',
  4: 'D',
  5: 'E',
  6: 'AA',
  7: 'BB',
  8: 'CC',
  9: 'K',
  '-': 'No reporta informacion',

};

// Tabla 16 – Estados de Cuentas corrientes y de ahorros
export const HCEstadoCuentaCcANDCa = {
  '01': {descripcion: 'Activa', vigente: true},
  '02': {descripcion: 'Cancelada por mal manejo', vigente: false},
  '05': {descripcion: 'Saldada', vigente: false},
  '06': {descripcion: 'Embargada', vigente: true},
  '07': {descripcion: 'Embargada-Activa', vigente: true},
  '09': {descripcion: 'Inactiva', vigente: false},
};

// Tabla 29 - situacion del titular
export  const HCSituacionTitular = {
  0: 'Normal',
  1: 'Concordato',
  2: 'Liquidación Forzosa',
  3: 'Liquidación Voluntaria',
  4: 'Proceso de Reorganización',
  5: 'Ley 550',
  6: 'Ley 1116',
  7: 'Otra',
  8: 'Liquidación Patrimonial',
};

// tabla 35
export const HCCalificacionCAAndCC = {
  0: '-',
  1: 'A',
  2: 'B',
  3: 'C',
};

// Tabla 36 – Clase de Cuenta de Ahorros y Corriente
export const HCClaseCuentaAC = {
  0: 'NOR',
  1: 'NOM',
  2: 'GMF',
  3: 'NGM',
  4: 'ELE',
  5: 'AFC/ACF',
};

// Tabla 40
export  const HCClaseTC = {
  '': 'No reportado',
  0: 'No reportado',
  1: 'Clásica',
  2: 'Gold',
  3: 'Platinum',
  4: 'Otra',
};

// Tabla 43 – Estado de la Cuenta
export const HCEstadoCuentaTCandCC = {
  '00': {descripcion: 'Entidad no reportó', vigente: true},
  '01': {descripcion: 'Al día',  vigente: true},
  '02': {descripcion: 'En Mora',  vigente: true},
  '03': {descripcion: 'Pago Total', vigente: true},
  '04': {descripcion: 'Pago Judicial', vigente: true},
  '05': {descripcion: 'Dudoso Recaudo', vigente: true},
  '06': {descripcion: 'Castigada', vigente: true},
  '07': {descripcion: 'Dación en Pago', vigente: true},
  '08': {descripcion: 'Cancelada Voluntariamente', vigente: false},
  '09': {descripcion: 'Cancelada por mal manejo', vigente: false},
  10: {descripcion: 'Prescripción', vigente: false},
  11: {descripcion: 'Cancelada por la entidad', vigente: false},
  12: {descripcion: 'Cancelada por reestructuración/refinanciación', vigente: false},
  13: {descripcion: 'Cancelada por venta', vigente: false},
  14: {descripcion: 'Insoluta', vigente: false},
  15: {descripcion: 'Cancelada por siniestro', vigente: false},
  16: {descripcion: 'Cancelada por Liquidación Patrimonial.', vigente: false},
};


export const CALIFICACIONES_RENOVACION = [
  'A',
  'AA',
  'AAA',
  'B',
];

export const TipoDestinoPrestamo = [
  {id: 1, name: 'Activo fijo'},
  {id: 2, name: 'Capital de trabajo'},
  {id: 3, name: 'Agricola'},
  {id: 4, name: 'Mejora de la calidad de vida de la familia'}
];

export const nombreCompletoMiembro: (cliente: Cliente) => string = ({datosPersonalesCliente}: Cliente): string => {
  const {nombre1, nombre2, apellido1, apellido2} = datosPersonalesCliente || {};
  return `${nombre1 || ''} ${nombre2 || ''} ${apellido1 || ''} ${apellido2 || ''}`;
};

export enum EstadoTransferencia {
  SolicitudRegistrada = 0,
  ProcesandoTransferencia = 1,
  TransferenciaFinalizada = 2,
  ListaTranferencia = 3,
}

export const Municipios = {
  "_id": "6f95360a441ba953567fc6e3b82836dd",
  "_rev": "2-f30e9e46bb80c0ecaff361248eb684b2",
  "coleccion": "municipios",
  "data": [
    {
      "id": 1,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05001",
      "municipio": "Medellín",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 2,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05002",
      "municipio": "Abejorral",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 3,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05004",
      "municipio": "Abriaquí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 4,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05021",
      "municipio": "Alejandría",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 5,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05030",
      "municipio": "Amagá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 6,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05031",
      "municipio": "Amalfi",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 7,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05034",
      "municipio": "Andes",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 8,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05036",
      "municipio": "Angelópolis",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 9,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05038",
      "municipio": "Angostura",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 10,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05040",
      "municipio": "Anorí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 11,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05042",
      "municipio": "Santafé de Antioquia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 12,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05044",
      "municipio": "Anza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 13,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05045",
      "municipio": "Apartadó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 14,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05051",
      "municipio": "Arboletes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 15,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05055",
      "municipio": "Argelia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 16,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05059",
      "municipio": "Armenia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 17,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05079",
      "municipio": "Barbosa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 18,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05086",
      "municipio": "Belmira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "id": 19,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05088",
      "municipio": "Bello",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 20,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05091",
      "municipio": "Betania",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 21,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05093",
      "municipio": "Betulia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "id": 22,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05101",
      "municipio": "Ciudad Bolívar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05107",
      "municipio": "Briceño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05113",
      "municipio": "Buriticá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05120",
      "municipio": "Cáceres",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05125",
      "municipio": "Caicedo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05129",
      "municipio": "Caldas",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05134",
      "municipio": "Campamento",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05138",
      "municipio": "Cañasgordas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05142",
      "municipio": "Caracolí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05145",
      "municipio": "Caramanta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05147",
      "municipio": "Carepa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05148",
      "municipio": "El Carmen de Viboral",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05150",
      "municipio": "Carolina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05154",
      "municipio": "Caucasia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05172",
      "municipio": "Chigorodó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05190",
      "municipio": "Cisneros",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05197",
      "municipio": "Cocorná",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05206",
      "municipio": "Concepción",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05209",
      "municipio": "Concordia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05212",
      "municipio": "Copacabana",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05234",
      "municipio": "Dabeiba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05237",
      "municipio": "Don Matías",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05240",
      "municipio": "Ebéjico",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05250",
      "municipio": "El Bagre",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05264",
      "municipio": "Entrerrios",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05266",
      "municipio": "Envigado",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05282",
      "municipio": "Fredonia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05284",
      "municipio": "Frontino",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05306",
      "municipio": "Giraldo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05308",
      "municipio": "Girardota",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05310",
      "municipio": "Gómez Plata",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05313",
      "municipio": "Granada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05315",
      "municipio": "Guadalupe",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05318",
      "municipio": "Guarne",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05321",
      "municipio": "Guatape",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05347",
      "municipio": "Heliconia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05353",
      "municipio": "Hispania",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05360",
      "municipio": "Itagui",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05361",
      "municipio": "Ituango",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05364",
      "municipio": "Jardín",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05368",
      "municipio": "Jericó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05376",
      "municipio": "La Ceja",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05380",
      "municipio": "La Estrella",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05390",
      "municipio": "La Pintada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05400",
      "municipio": "La Unión",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05411",
      "municipio": "Liborina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05425",
      "municipio": "Maceo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05440",
      "municipio": "Marinilla",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05467",
      "municipio": "Montebello",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05475",
      "municipio": "Murindó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05480",
      "municipio": "Mutatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05483",
      "municipio": "Nariño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05490",
      "municipio": "Necoclí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05495",
      "municipio": "Nechí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05501",
      "municipio": "Olaya",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05541",
      "municipio": "Peñol",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05543",
      "municipio": "Peque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05576",
      "municipio": "Pueblorrico",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05579",
      "municipio": "Puerto Berrío",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05585",
      "municipio": "Puerto Nare",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05591",
      "municipio": "Puerto Triunfo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05604",
      "municipio": "Remedios",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05607",
      "municipio": "Retiro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05615",
      "municipio": "Rionegro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05628",
      "municipio": "Sabanalarga",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05631",
      "municipio": "Sabaneta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05642",
      "municipio": "Salgar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05647",
      "municipio": "San Andrés de Cuerquía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05649",
      "municipio": "San Carlos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05652",
      "municipio": "San Francisco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05656",
      "municipio": "San Jerónimo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05658",
      "municipio": "San José de la Montaña",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05659",
      "municipio": "San Juan de Urabá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05660",
      "municipio": "San Luis",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05664",
      "municipio": "San Pedro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05665",
      "municipio": "San Pedro de Uraba",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05667",
      "municipio": "San Rafael",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05670",
      "municipio": "San Roque",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05674",
      "municipio": "San Vicente",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05679",
      "municipio": "Santa Bárbara",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05686",
      "municipio": "Santa Rosa de Osos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05690",
      "municipio": "Santo Domingo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05697",
      "municipio": "El Santuario",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05736",
      "municipio": "Segovia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05756",
      "municipio": "Sonson",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05761",
      "municipio": "Sopetrán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05789",
      "municipio": "Támesis",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05790",
      "municipio": "Tarazá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05792",
      "municipio": "Tarso",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05809",
      "municipio": "Titiribí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05819",
      "municipio": "Toledo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05837",
      "municipio": "Turbo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05842",
      "municipio": "Uramita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05847",
      "municipio": "Urrao",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05854",
      "municipio": "Valdivia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05856",
      "municipio": "Valparaíso",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05858",
      "municipio": "Vegachí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05861",
      "municipio": "Venecia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05873",
      "municipio": "Vigía del Fuerte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05885",
      "municipio": "Yalí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05887",
      "municipio": "Yarumal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05890",
      "municipio": "Yolombó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05893",
      "municipio": "Yondó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia",
      "divipolam": "05895",
      "municipio": "Zaragoza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08001",
      "municipio": "Barranquilla",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08078",
      "municipio": "Baranoa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08137",
      "municipio": "Campo de la Cruz",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08141",
      "municipio": "Candelaria",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08296",
      "municipio": "Galapa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08372",
      "municipio": "Juan de Acosta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08421",
      "municipio": "Luruaco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08433",
      "municipio": "Malambo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08436",
      "municipio": "Manatí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08520",
      "municipio": "Palmar de Varela",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08549",
      "municipio": "Piojó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08558",
      "municipio": "Polonuevo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08560",
      "municipio": "Ponedera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08573",
      "municipio": "Puerto Colombia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08606",
      "municipio": "Repelón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08634",
      "municipio": "Sabanagrande",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08638",
      "municipio": "Sabanalarga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08675",
      "municipio": "Santa Lucía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08685",
      "municipio": "Santo Tomás",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08758",
      "municipio": "Soledad",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08770",
      "municipio": "Suan",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08832",
      "municipio": "Tubará",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico",
      "divipolam": "08849",
      "municipio": "Usiacurí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "11",
      "departamento": "Bogotá",
      "divipolam": "11001",
      "municipio": "Bogotá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13001",
      "municipio": "Cartagena",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13006",
      "municipio": "Achí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13030",
      "municipio": "Altos del Rosario",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13042",
      "municipio": "Arenal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13052",
      "municipio": "Arjona",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13062",
      "municipio": "Arroyohondo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13074",
      "municipio": "Barranco de Loba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13140",
      "municipio": "Calamar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13160",
      "municipio": "Cantagallo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13188",
      "municipio": "Cicuco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13212",
      "municipio": "Córdoba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13222",
      "municipio": "Clemencia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13244",
      "municipio": "El Carmen de Bolívar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13248",
      "municipio": "El Guamo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13268",
      "municipio": "El Peñón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13300",
      "municipio": "Hatillo de Loba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13430",
      "municipio": "Magangué",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13433",
      "municipio": "Mahates",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13440",
      "municipio": "Margarita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13442",
      "municipio": "María La Baja",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13458",
      "municipio": "Montecristo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13468",
      "municipio": "Mompós",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13473",
      "municipio": "Morales",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13490",
      "municipio": "Norosí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13549",
      "municipio": "Pinillos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13580",
      "municipio": "Regidor",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13600",
      "municipio": "Río Viejo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13620",
      "municipio": "San Cristóbal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13647",
      "municipio": "San Estanislao",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13650",
      "municipio": "San Fernando",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13654",
      "municipio": "San Jacinto",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13655",
      "municipio": "San Jacinto del Cauca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13657",
      "municipio": "San Juan Nepomuceno",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13667",
      "municipio": "San Martín de Loba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13670",
      "municipio": "San Pablo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13673",
      "municipio": "Santa Catalina",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13683",
      "municipio": "Santa Rosa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13688",
      "municipio": "Santa Rosa del Sur",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13744",
      "municipio": "Simití",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13760",
      "municipio": "Soplaviento",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13780",
      "municipio": "Talaigua Nuevo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13810",
      "municipio": "Tiquisio",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13836",
      "municipio": "Turbaco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13838",
      "municipio": "Turbaná",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13873",
      "municipio": "Villanueva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar",
      "divipolam": "13894",
      "municipio": "Zambrano",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15001",
      "municipio": "Tunja",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15022",
      "municipio": "Almeida",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15047",
      "municipio": "Aquitania",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15051",
      "municipio": "Arcabuco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15087",
      "municipio": "Belén",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15090",
      "municipio": "Berbeo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15092",
      "municipio": "Betéitiva",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15097",
      "municipio": "Boavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15104",
      "municipio": "Boyacá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15106",
      "municipio": "Briceño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15109",
      "municipio": "Buenavista",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15114",
      "municipio": "Busbanzá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15131",
      "municipio": "Caldas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15135",
      "municipio": "Campohermoso",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15162",
      "municipio": "Cerinza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15172",
      "municipio": "Chinavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15176",
      "municipio": "Chiquinquirá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15180",
      "municipio": "Chiscas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15183",
      "municipio": "Chita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15185",
      "municipio": "Chitaraque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15187",
      "municipio": "Chivatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15189",
      "municipio": "Ciénega",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15204",
      "municipio": "Cómbita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15212",
      "municipio": "Coper",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15215",
      "municipio": "Corrales",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15218",
      "municipio": "Covarachía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15223",
      "municipio": "Cubará",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15224",
      "municipio": "Cucaita",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15226",
      "municipio": "Cuítiva",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15232",
      "municipio": "Chíquiza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15236",
      "municipio": "Chivor",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15238",
      "municipio": "Duitama",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15244",
      "municipio": "El Cocuy",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15248",
      "municipio": "El Espino",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15272",
      "municipio": "Firavitoba",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15276",
      "municipio": "Floresta",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15293",
      "municipio": "Gachantivá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15296",
      "municipio": "Gameza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15299",
      "municipio": "Garagoa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15317",
      "municipio": "Guacamayas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15322",
      "municipio": "Guateque",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15325",
      "municipio": "Guayatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15332",
      "municipio": "Güicán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15362",
      "municipio": "Iza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15367",
      "municipio": "Jenesano",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15368",
      "municipio": "Jericó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15377",
      "municipio": "Labranzagrande",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15380",
      "municipio": "La Capilla",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15401",
      "municipio": "La Victoria",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15403",
      "municipio": "La Uvita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15407",
      "municipio": "Villa de Leyva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15425",
      "municipio": "Macanal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15442",
      "municipio": "Maripí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15455",
      "municipio": "Miraflores",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15464",
      "municipio": "Mongua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15466",
      "municipio": "Monguí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15469",
      "municipio": "Moniquirá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15476",
      "municipio": "Motavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15480",
      "municipio": "Muzo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15491",
      "municipio": "Nobsa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15494",
      "municipio": "Nuevo Colón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15500",
      "municipio": "Oicatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15507",
      "municipio": "Otanche",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15511",
      "municipio": "Pachavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15514",
      "municipio": "Páez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15516",
      "municipio": "Paipa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15518",
      "municipio": "Pajarito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15522",
      "municipio": "Panqueba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15531",
      "municipio": "Pauna",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15533",
      "municipio": "Paya",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15537",
      "municipio": "Paz de Río",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15542",
      "municipio": "Pesca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15550",
      "municipio": "Pisba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15572",
      "municipio": "Puerto Boyacá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15580",
      "municipio": "Quípama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15599",
      "municipio": "Ramiriquí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15600",
      "municipio": "Ráquira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15621",
      "municipio": "Rondón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15632",
      "municipio": "Saboyá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15638",
      "municipio": "Sáchica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15646",
      "municipio": "Samacá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15660",
      "municipio": "San Eduardo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15664",
      "municipio": "San José de Pare",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15667",
      "municipio": "San Luis de Gaceno",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15673",
      "municipio": "San Mateo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15676",
      "municipio": "San Miguel de Sema",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15681",
      "municipio": "San Pablo de Borbur",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15686",
      "municipio": "Santana",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15690",
      "municipio": "Santa María",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15693",
      "municipio": "Santa Rosa de Viterbo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15696",
      "municipio": "Santa Sofía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15720",
      "municipio": "Sativanorte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15723",
      "municipio": "Sativasur",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15740",
      "municipio": "Siachoque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15753",
      "municipio": "Soatá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15755",
      "municipio": "Socotá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15757",
      "municipio": "Socha",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15759",
      "municipio": "Sogamoso",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15761",
      "municipio": "Somondoco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15762",
      "municipio": "Sora",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15763",
      "municipio": "Sotaquirá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15764",
      "municipio": "Soracá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15774",
      "municipio": "Susacón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15776",
      "municipio": "Sutamarchán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15778",
      "municipio": "Sutatenza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15790",
      "municipio": "Tasco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15798",
      "municipio": "Tenza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15804",
      "municipio": "Tibaná",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15806",
      "municipio": "Tibasosa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15808",
      "municipio": "Tinjacá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15810",
      "municipio": "Tipacoque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15814",
      "municipio": "Toca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15816",
      "municipio": "Togüí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15820",
      "municipio": "Tópaga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15822",
      "municipio": "Tota",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15832",
      "municipio": "Tununguá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15835",
      "municipio": "Turmequé",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15837",
      "municipio": "Tuta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15839",
      "municipio": "Tutazá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15842",
      "municipio": "Umbita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15861",
      "municipio": "Ventaquemada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15879",
      "municipio": "Viracachá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá",
      "divipolam": "15897",
      "municipio": "Zetaquira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17001",
      "municipio": "Manizales",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17013",
      "municipio": "Aguadas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17042",
      "municipio": "Anserma",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17050",
      "municipio": "Aranzazu",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17088",
      "municipio": "Belalcázar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17174",
      "municipio": "Chinchiná",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17272",
      "municipio": "Filadelfia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17380",
      "municipio": "La Dorada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17388",
      "municipio": "La Merced",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17433",
      "municipio": "Manzanares",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17442",
      "municipio": "Marmato",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17444",
      "municipio": "Marquetalia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17446",
      "municipio": "Marulanda",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17486",
      "municipio": "Neira",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17495",
      "municipio": "Norcasia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17513",
      "municipio": "Pácora",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17524",
      "municipio": "Palestina",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17541",
      "municipio": "Pensilvania",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17614",
      "municipio": "Riosucio",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17616",
      "municipio": "Risaralda",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17653",
      "municipio": "Salamina",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17662",
      "municipio": "Samaná",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17665",
      "municipio": "San José",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17777",
      "municipio": "Supía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17867",
      "municipio": "Victoria",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17873",
      "municipio": "Villamaría",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas",
      "divipolam": "17877",
      "municipio": "Viterbo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18001",
      "municipio": "Florencia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18029",
      "municipio": "Albania",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18094",
      "municipio": "Belén de los Andaquies",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18150",
      "municipio": "Cartagena del Chairá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18205",
      "municipio": "Curillo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18247",
      "municipio": "El Doncello",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18256",
      "municipio": "El Paujil",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18410",
      "municipio": "La Montañita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18460",
      "municipio": "Milán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18479",
      "municipio": "Morelia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18592",
      "municipio": "Puerto Rico",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18610",
      "municipio": "San José del Fragua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18753",
      "municipio": "San Vicente del Caguán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18756",
      "municipio": "Solano",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18785",
      "municipio": "Solita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá",
      "divipolam": "18860",
      "municipio": "Valparaíso",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19001",
      "municipio": "Popayán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19022",
      "municipio": "Almaguer",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19050",
      "municipio": "Argelia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19075",
      "municipio": "Balboa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19100",
      "municipio": "Bolívar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19110",
      "municipio": "Buenos Aires",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19130",
      "municipio": "Cajibío",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19137",
      "municipio": "Caldono",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19142",
      "municipio": "Caloto",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19212",
      "municipio": "Corinto",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19256",
      "municipio": "El Tambo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19290",
      "municipio": "Florencia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19300",
      "municipio": "Guachené",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19318",
      "municipio": "Guapi",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19355",
      "municipio": "Inzá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19364",
      "municipio": "Jambaló",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19392",
      "municipio": "La Sierra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19397",
      "municipio": "La Vega",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19418",
      "municipio": "López",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19450",
      "municipio": "Mercaderes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19455",
      "municipio": "Miranda",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19473",
      "municipio": "Morales",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19513",
      "municipio": "Padilla",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19517",
      "municipio": "Paez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19532",
      "municipio": "Patía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19533",
      "municipio": "Piamonte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19548",
      "municipio": "Piendamó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19573",
      "municipio": "Puerto Tejada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19585",
      "municipio": "Puracé",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19622",
      "municipio": "Rosas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19693",
      "municipio": "San Sebastián",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19698",
      "municipio": "Santander de Quilichao",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19701",
      "municipio": "Santa Rosa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19743",
      "municipio": "Silvia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19760",
      "municipio": "Sotara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19780",
      "municipio": "Suárez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19785",
      "municipio": "Sucre",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19807",
      "municipio": "Timbío",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19809",
      "municipio": "Timbiquí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19821",
      "municipio": "Toribio",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19824",
      "municipio": "Totoró",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca",
      "divipolam": "19845",
      "municipio": "Villa Rica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20001",
      "municipio": "Valledupar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20011",
      "municipio": "Aguachica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20013",
      "municipio": "Agustín Codazzi",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20032",
      "municipio": "Astrea",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20045",
      "municipio": "Becerril",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20060",
      "municipio": "Bosconia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20175",
      "municipio": "Chimichagua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20178",
      "municipio": "Chiriguaná",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20228",
      "municipio": "Curumaní",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20238",
      "municipio": "El Copey",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20250",
      "municipio": "El Paso",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20295",
      "municipio": "Gamarra",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20310",
      "municipio": "González",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20383",
      "municipio": "La Gloria",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20400",
      "municipio": "La Jagua de Ibirico",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20443",
      "municipio": "Manaure",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20517",
      "municipio": "Pailitas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20550",
      "municipio": "Pelaya",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20570",
      "municipio": "Pueblo Bello",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20614",
      "municipio": "Río de Oro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20621",
      "municipio": "La Paz",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20710",
      "municipio": "San Alberto",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20750",
      "municipio": "San Diego",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20770",
      "municipio": "San Martín",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar",
      "divipolam": "20787",
      "municipio": "Tamalameque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23001",
      "municipio": "Montería",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23068",
      "municipio": "Ayapel",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23079",
      "municipio": "Buenavista",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23090",
      "municipio": "Canalete",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23162",
      "municipio": "Cereté",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23168",
      "municipio": "Chimá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23182",
      "municipio": "Chinú",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23189",
      "municipio": "Ciénaga de Oro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23300",
      "municipio": "Cotorra",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23350",
      "municipio": "La Apartada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23417",
      "municipio": "Lorica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23419",
      "municipio": "Los Córdobas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23464",
      "municipio": "Momil",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23466",
      "municipio": "Montelíbano",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23500",
      "municipio": "Moñitos",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23555",
      "municipio": "Planeta Rica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23570",
      "municipio": "Pueblo Nuevo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23574",
      "municipio": "Puerto Escondido",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23580",
      "municipio": "Puerto Libertador",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23586",
      "municipio": "Purísima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23660",
      "municipio": "Sahagún",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23670",
      "municipio": "San Andrés Sotavento",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23672",
      "municipio": "San Antero",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23675",
      "municipio": "San Bernardo del Viento",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23678",
      "municipio": "San Carlos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23682",
      "municipio": "San José de Ure",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23686",
      "municipio": "San Pelayo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23807",
      "municipio": "Tierralta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23815",
      "municipio": "Tuchín",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba",
      "divipolam": "23855",
      "municipio": "Valencia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25001",
      "municipio": "Agua de Dios",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25019",
      "municipio": "Albán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25035",
      "municipio": "Anapoima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25040",
      "municipio": "Anolaima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25053",
      "municipio": "Arbeláez",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25086",
      "municipio": "Beltrán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25095",
      "municipio": "Bituima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25099",
      "municipio": "Bojacá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25120",
      "municipio": "Cabrera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25123",
      "municipio": "Cachipay",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25126",
      "municipio": "Cajicá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25148",
      "municipio": "Caparrapí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25151",
      "municipio": "Caqueza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25154",
      "municipio": "Carmen de Carupa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25168",
      "municipio": "Chaguaní",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25175",
      "municipio": "Chía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25178",
      "municipio": "Chipaque",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25181",
      "municipio": "Choachí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25183",
      "municipio": "Chocontá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25200",
      "municipio": "Cogua",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25214",
      "municipio": "Cota",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25224",
      "municipio": "Cucunubá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25245",
      "municipio": "El Colegio",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25258",
      "municipio": "El Peñón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25260",
      "municipio": "El Rosal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25269",
      "municipio": "Facatativá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25279",
      "municipio": "Fomeque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25281",
      "municipio": "Fosca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25286",
      "municipio": "Funza",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25288",
      "municipio": "Fúquene",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25290",
      "municipio": "Fusagasugá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25293",
      "municipio": "Gachala",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25295",
      "municipio": "Gachancipá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25297",
      "municipio": "Gachetá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25299",
      "municipio": "Gama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25307",
      "municipio": "Girardot",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25312",
      "municipio": "Granada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25317",
      "municipio": "Guachetá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25320",
      "municipio": "Guaduas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25322",
      "municipio": "Guasca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25324",
      "municipio": "Guataquí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25326",
      "municipio": "Guatavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25328",
      "municipio": "Guayabal de Siquima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25335",
      "municipio": "Guayabetal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25339",
      "municipio": "Gutiérrez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25368",
      "municipio": "Jerusalén",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25372",
      "municipio": "Junín",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25377",
      "municipio": "La Calera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25386",
      "municipio": "La Mesa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25394",
      "municipio": "La Palma",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25398",
      "municipio": "La Peña",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25402",
      "municipio": "La Vega",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25407",
      "municipio": "Lenguazaque",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25426",
      "municipio": "Macheta",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25430",
      "municipio": "Madrid",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25436",
      "municipio": "Manta",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25438",
      "municipio": "Medina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25473",
      "municipio": "Mosquera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25483",
      "municipio": "Nariño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25486",
      "municipio": "Nemocón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25488",
      "municipio": "Nilo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25489",
      "municipio": "Nimaima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25491",
      "municipio": "Nocaima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25506",
      "municipio": "Venecia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25513",
      "municipio": "Pacho",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25518",
      "municipio": "Paime",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25524",
      "municipio": "Pandi",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25530",
      "municipio": "Paratebueno",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25535",
      "municipio": "Pasca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25572",
      "municipio": "Puerto Salgar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25580",
      "municipio": "Pulí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25592",
      "municipio": "Quebradanegra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25594",
      "municipio": "Quetame",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25596",
      "municipio": "Quipile",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25599",
      "municipio": "Apulo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25612",
      "municipio": "Ricaurte",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25645",
      "municipio": "San Antonio del Tequendama",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25649",
      "municipio": "San Bernardo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25653",
      "municipio": "San Cayetano",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25658",
      "municipio": "San Francisco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25662",
      "municipio": "San Juan de Río Seco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25718",
      "municipio": "Sasaima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25736",
      "municipio": "Sesquilé",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25740",
      "municipio": "Sibaté",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25743",
      "municipio": "Silvania",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25745",
      "municipio": "Simijaca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25754",
      "municipio": "Soacha",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25758",
      "municipio": "Sopó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25769",
      "municipio": "Subachoque",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25772",
      "municipio": "Suesca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25777",
      "municipio": "Supatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25779",
      "municipio": "Susa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25781",
      "municipio": "Sutatausa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25785",
      "municipio": "Tabio",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25793",
      "municipio": "Tausa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25797",
      "municipio": "Tena",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25799",
      "municipio": "Tenjo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25805",
      "municipio": "Tibacuy",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25807",
      "municipio": "Tibirita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25815",
      "municipio": "Tocaima",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25817",
      "municipio": "Tocancipá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25823",
      "municipio": "Topaipí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25839",
      "municipio": "Ubalá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25841",
      "municipio": "Ubaque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25843",
      "municipio": "Villa de San Diego de Ubate",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25845",
      "municipio": "Une",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25851",
      "municipio": "Útica",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25862",
      "municipio": "Vergara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25867",
      "municipio": "Vianí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25871",
      "municipio": "Villagómez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25873",
      "municipio": "Villapinzón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25875",
      "municipio": "Villeta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25878",
      "municipio": "Viotá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25885",
      "municipio": "Yacopí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25898",
      "municipio": "Zipacón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca",
      "divipolam": "25899",
      "municipio": "Zipaquirá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27001",
      "municipio": "Quibdó",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27006",
      "municipio": "Acandí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27025",
      "municipio": "Alto Baudo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27050",
      "municipio": "Atrato",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27073",
      "municipio": "Bagadó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27075",
      "municipio": "Bahía Solano",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27077",
      "municipio": "Bajo Baudó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27099",
      "municipio": "Bojaya",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27135",
      "municipio": "El Cantón del San Pablo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27150",
      "municipio": "Carmen del Darien",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27160",
      "municipio": "Cértegui",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27205",
      "municipio": "Condoto",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27245",
      "municipio": "El Carmen de Atrato",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27250",
      "municipio": "El Litoral del San Juan",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27361",
      "municipio": "Istmina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27372",
      "municipio": "Juradó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27413",
      "municipio": "Lloró",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27425",
      "municipio": "Medio Atrato",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27430",
      "municipio": "Medio Baudó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27450",
      "municipio": "Medio San Juan",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27491",
      "municipio": "Nóvita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27495",
      "municipio": "Nuquí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27580",
      "municipio": "Río Iro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27600",
      "municipio": "Río Quito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27615",
      "municipio": "Riosucio",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27660",
      "municipio": "San José del Palmar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27745",
      "municipio": "Sipí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27787",
      "municipio": "Tadó",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27800",
      "municipio": "Unguía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó",
      "divipolam": "27810",
      "municipio": "Unión Panamericana",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41001",
      "municipio": "Neiva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41006",
      "municipio": "Acevedo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41013",
      "municipio": "Agrado",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41016",
      "municipio": "Aipe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41020",
      "municipio": "Algeciras",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41026",
      "municipio": "Altamira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41078",
      "municipio": "Baraya",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41132",
      "municipio": "Campoalegre",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41206",
      "municipio": "Colombia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41244",
      "municipio": "Elías",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41298",
      "municipio": "Garzón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41306",
      "municipio": "Gigante",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41319",
      "municipio": "Guadalupe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41349",
      "municipio": "Hobo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41357",
      "municipio": "Iquira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41359",
      "municipio": "Isnos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41378",
      "municipio": "La Argentina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41396",
      "municipio": "La Plata",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41483",
      "municipio": "Nátaga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41503",
      "municipio": "Oporapa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41518",
      "municipio": "Paicol",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41524",
      "municipio": "Palermo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41530",
      "municipio": "Palestina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41548",
      "municipio": "Pital",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41551",
      "municipio": "Pitalito",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41615",
      "municipio": "Rivera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41660",
      "municipio": "Saladoblanco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41668",
      "municipio": "San Agustín",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41676",
      "municipio": "Santa María",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41770",
      "municipio": "Suaza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41791",
      "municipio": "Tarqui",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41797",
      "municipio": "Tesalia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41799",
      "municipio": "Tello",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41801",
      "municipio": "Teruel",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41807",
      "municipio": "Timaná",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41872",
      "municipio": "Villavieja",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila",
      "divipolam": "41885",
      "municipio": "Yaguará",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44001",
      "municipio": "Riohacha",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44035",
      "municipio": "Albania",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44078",
      "municipio": "Barrancas",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44090",
      "municipio": "Dibulla",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44098",
      "municipio": "Distracción",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44110",
      "municipio": "El Molino",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44279",
      "municipio": "Fonseca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44378",
      "municipio": "Hatonuevo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44420",
      "municipio": "La Jagua del Pilar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44430",
      "municipio": "Maicao",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44560",
      "municipio": "Manaure",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44650",
      "municipio": "San Juan del Cesar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44847",
      "municipio": "Uribia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44855",
      "municipio": "Urumita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira",
      "divipolam": "44874",
      "municipio": "Villanueva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47001",
      "municipio": "Santa Marta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47030",
      "municipio": "Algarrobo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47053",
      "municipio": "Aracataca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47058",
      "municipio": "Ariguaní",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47161",
      "municipio": "Cerro San Antonio",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47170",
      "municipio": "Chibolo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47189",
      "municipio": "Ciénaga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47205",
      "municipio": "Concordia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47245",
      "municipio": "El Banco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47258",
      "municipio": "El Piñon",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47268",
      "municipio": "El Retén",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47288",
      "municipio": "Fundación",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47318",
      "municipio": "Guamal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47460",
      "municipio": "Nueva Granada",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47541",
      "municipio": "Pedraza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47545",
      "municipio": "Pijiño del Carmen",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47551",
      "municipio": "Pivijay",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47555",
      "municipio": "Plato",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47570",
      "municipio": "Puebloviejo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47605",
      "municipio": "Remolino",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47660",
      "municipio": "Sabanas de San Angel",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47675",
      "municipio": "Salamina",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47692",
      "municipio": "San Sebastián de Buenavista",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47703",
      "municipio": "San Zenón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47707",
      "municipio": "Santa Ana",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47720",
      "municipio": "Santa Bárbara de Pinto",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47745",
      "municipio": "Sitionuevo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47798",
      "municipio": "Tenerife",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47960",
      "municipio": "Zapayán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena",
      "divipolam": "47980",
      "municipio": "Zona Bananera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50001",
      "municipio": "Villavicencio",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50006",
      "municipio": "Acacías",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50110",
      "municipio": "Barranca de Upía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50124",
      "municipio": "Cabuyaro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50150",
      "municipio": "Castilla La Nueva",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50223",
      "municipio": "Cubarral",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50226",
      "municipio": "Cumaral",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50245",
      "municipio": "El Calvario",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50251",
      "municipio": "El Castillo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50270",
      "municipio": "El Dorado",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50287",
      "municipio": "Fuente de Oro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50313",
      "municipio": "Granada",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50318",
      "municipio": "Guamal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50325",
      "municipio": "Mapiripán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50330",
      "municipio": "Mesetas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50350",
      "municipio": "La Macarena",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50370",
      "municipio": "Uribe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50400",
      "municipio": "Lejanías",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50450",
      "municipio": "Puerto Concordia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50568",
      "municipio": "Puerto Gaitán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50573",
      "municipio": "Puerto López",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50577",
      "municipio": "Puerto Lleras",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50590",
      "municipio": "Puerto Rico",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50606",
      "municipio": "Restrepo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50680",
      "municipio": "San Carlos de Guaroa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50683",
      "municipio": "San Juan de Arama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50686",
      "municipio": "San Juanito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50689",
      "municipio": "San Martín",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta",
      "divipolam": "50711",
      "municipio": "Vistahermosa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52001",
      "municipio": "Pasto",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52019",
      "municipio": "Albán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52022",
      "municipio": "Aldana",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52036",
      "municipio": "Ancuyá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52051",
      "municipio": "Arboleda",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52079",
      "municipio": "Barbacoas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52083",
      "municipio": "Belén",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52110",
      "municipio": "Buesaco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52203",
      "municipio": "Colón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52207",
      "municipio": "Consaca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52210",
      "municipio": "Contadero",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52215",
      "municipio": "Córdoba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52224",
      "municipio": "Cuaspud",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52227",
      "municipio": "Cumbal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52233",
      "municipio": "Cumbitara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52240",
      "municipio": "Chachagüí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52250",
      "municipio": "El Charco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52254",
      "municipio": "El Peñol",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52256",
      "municipio": "El Rosario",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52258",
      "municipio": "El Tablón de Gómez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52260",
      "municipio": "El Tambo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52287",
      "municipio": "Funes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52317",
      "municipio": "Guachucal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52320",
      "municipio": "Guaitarilla",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52323",
      "municipio": "Gualmatán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52352",
      "municipio": "Iles",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52354",
      "municipio": "Imués",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52356",
      "municipio": "Ipiales",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52378",
      "municipio": "La Cruz",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52381",
      "municipio": "La Florida",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52385",
      "municipio": "La Llanada",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52390",
      "municipio": "La Tola",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52399",
      "municipio": "La Unión",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52405",
      "municipio": "Leiva",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52411",
      "municipio": "Linares",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52418",
      "municipio": "Los Andes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52427",
      "municipio": "Magüi",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52435",
      "municipio": "Mallama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52473",
      "municipio": "Mosquera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52480",
      "municipio": "Nariño",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52490",
      "municipio": "Olaya Herrera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52506",
      "municipio": "Ospina",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52520",
      "municipio": "Francisco Pizarro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52540",
      "municipio": "Policarpa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52560",
      "municipio": "Potosí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52565",
      "municipio": "Providencia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52573",
      "municipio": "Puerres",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52585",
      "municipio": "Pupiales",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52612",
      "municipio": "Ricaurte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52621",
      "municipio": "Roberto Payán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52678",
      "municipio": "Samaniego",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52683",
      "municipio": "Sandoná",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52685",
      "municipio": "San Bernardo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52687",
      "municipio": "San Lorenzo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52693",
      "municipio": "San Pablo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52694",
      "municipio": "San Pedro de Cartago",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52696",
      "municipio": "Santa Bárbara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52699",
      "municipio": "Santacruz",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52720",
      "municipio": "Sapuyes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52786",
      "municipio": "Taminango",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52788",
      "municipio": "Tangua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52835",
      "municipio": "San Andres de Tumaco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52838",
      "municipio": "Túquerres",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño",
      "divipolam": "52885",
      "municipio": "Yacuanquer",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54001",
      "municipio": "Cúcuta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54003",
      "municipio": "Abrego",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54051",
      "municipio": "Arboledas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54099",
      "municipio": "Bochalema",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54109",
      "municipio": "Bucarasica",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54125",
      "municipio": "Cácota",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54128",
      "municipio": "Cachirá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54172",
      "municipio": "Chinácota",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54174",
      "municipio": "Chitagá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54206",
      "municipio": "Convención",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54223",
      "municipio": "Cucutilla",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54239",
      "municipio": "Durania",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54245",
      "municipio": "El Carmen",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54250",
      "municipio": "El Tarra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54261",
      "municipio": "El Zulia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54313",
      "municipio": "Gramalote",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54344",
      "municipio": "Hacarí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54347",
      "municipio": "Herrán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54377",
      "municipio": "Labateca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54385",
      "municipio": "La Esperanza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54398",
      "municipio": "La Playa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54405",
      "municipio": "Los Patios",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54418",
      "municipio": "Lourdes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54480",
      "municipio": "Mutiscua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54498",
      "municipio": "Ocaña",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54518",
      "municipio": "Pamplona",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54520",
      "municipio": "Pamplonita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54553",
      "municipio": "Puerto Santander",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54599",
      "municipio": "Ragonvalia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54660",
      "municipio": "Salazar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54670",
      "municipio": "San Calixto",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54673",
      "municipio": "San Cayetano",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54680",
      "municipio": "Santiago",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54720",
      "municipio": "Sardinata",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54743",
      "municipio": "Silos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54800",
      "municipio": "Teorama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54810",
      "municipio": "Tibú",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54820",
      "municipio": "Toledo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54871",
      "municipio": "Villa Caro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander",
      "divipolam": "54874",
      "municipio": "Villa del Rosario",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63001",
      "municipio": "Armenia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63111",
      "municipio": "Buenavista",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63130",
      "municipio": "Calarcá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63190",
      "municipio": "Circasia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63212",
      "municipio": "Córdoba",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63272",
      "municipio": "Filandia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63302",
      "municipio": "Génova",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63401",
      "municipio": "La Tebaida",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63470",
      "municipio": "Montenegro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63548",
      "municipio": "Pijao",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63594",
      "municipio": "Quimbaya",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío",
      "divipolam": "63690",
      "municipio": "Salento",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66001",
      "municipio": "Pereira",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66045",
      "municipio": "Apía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66075",
      "municipio": "Balboa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66088",
      "municipio": "Belén de Umbría",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66170",
      "municipio": "Dosquebradas",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66318",
      "municipio": "Guática",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66383",
      "municipio": "La Celia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66400",
      "municipio": "La Virginia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66440",
      "municipio": "Marsella",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66456",
      "municipio": "Mistrató",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66572",
      "municipio": "Pueblo Rico",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66594",
      "municipio": "Quinchía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66682",
      "municipio": "Santa Rosa de Cabal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda",
      "divipolam": "66687",
      "municipio": "Santuario",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68001",
      "municipio": "Bucaramanga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68013",
      "municipio": "Aguada",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68020",
      "municipio": "Albania",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68051",
      "municipio": "Aratoca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68077",
      "municipio": "Barbosa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68079",
      "municipio": "Barichara",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68081",
      "municipio": "Barrancabermeja",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68092",
      "municipio": "Betulia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68101",
      "municipio": "Bolívar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68121",
      "municipio": "Cabrera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68132",
      "municipio": "California",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68147",
      "municipio": "Capitanejo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68152",
      "municipio": "Carcasí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68160",
      "municipio": "Cepitá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68162",
      "municipio": "Cerrito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68167",
      "municipio": "Charalá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68169",
      "municipio": "Charta",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68176",
      "municipio": "Chima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68179",
      "municipio": "Chipatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68190",
      "municipio": "Cimitarra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68207",
      "municipio": "Concepción",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68209",
      "municipio": "Confines",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68211",
      "municipio": "Contratación",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68217",
      "municipio": "Coromoro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68229",
      "municipio": "Curití",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68235",
      "municipio": "El Carmen de Chucurí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68245",
      "municipio": "El Guacamayo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68250",
      "municipio": "El Peñón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68255",
      "municipio": "El Playón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68264",
      "municipio": "Encino",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68266",
      "municipio": "Enciso",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68271",
      "municipio": "Florián",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68276",
      "municipio": "Floridablanca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68296",
      "municipio": "Galán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68298",
      "municipio": "Gambita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68307",
      "municipio": "Girón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68318",
      "municipio": "Guaca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68320",
      "municipio": "Guadalupe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68322",
      "municipio": "Guapotá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68324",
      "municipio": "Guavatá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68327",
      "municipio": "Güepsa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68344",
      "municipio": "Hato",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68368",
      "municipio": "Jesús María",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68370",
      "municipio": "Jordán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68377",
      "municipio": "La Belleza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68385",
      "municipio": "Landázuri",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68397",
      "municipio": "La Paz",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68406",
      "municipio": "Lebríja",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68418",
      "municipio": "Los Santos",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68425",
      "municipio": "Macaravita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68432",
      "municipio": "Málaga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68444",
      "municipio": "Matanza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68464",
      "municipio": "Mogotes",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68468",
      "municipio": "Molagavita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68498",
      "municipio": "Ocamonte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68500",
      "municipio": "Oiba",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68502",
      "municipio": "Onzaga",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68522",
      "municipio": "Palmar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68524",
      "municipio": "Palmas del Socorro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68533",
      "municipio": "Páramo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68547",
      "municipio": "Piedecuesta",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68549",
      "municipio": "Pinchote",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68572",
      "municipio": "Puente Nacional",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68573",
      "municipio": "Puerto Parra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68575",
      "municipio": "Puerto Wilches",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68615",
      "municipio": "Rionegro",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68655",
      "municipio": "Sabana de Torres",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68669",
      "municipio": "San Andrés",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68673",
      "municipio": "San Benito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68679",
      "municipio": "San Gil",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68682",
      "municipio": "San Joaquín",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68684",
      "municipio": "San José de Miranda",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68686",
      "municipio": "San Miguel",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68689",
      "municipio": "San Vicente de Chucurí",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68705",
      "municipio": "Santa Bárbara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68720",
      "municipio": "Santa Helena del Opón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68745",
      "municipio": "Simacota",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68755",
      "municipio": "Socorro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68770",
      "municipio": "Suaita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68773",
      "municipio": "Sucre",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68780",
      "municipio": "Suratá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68820",
      "municipio": "Tona",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68855",
      "municipio": "Valle de San José",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68861",
      "municipio": "Vélez",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68867",
      "municipio": "Vetas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68872",
      "municipio": "Villanueva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander",
      "divipolam": "68895",
      "municipio": "Zapatoca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70001",
      "municipio": "Sincelejo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70110",
      "municipio": "Buenavista",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70124",
      "municipio": "Caimito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70204",
      "municipio": "Coloso",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70215",
      "municipio": "Corozal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70221",
      "municipio": "Coveñas",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70230",
      "municipio": "Chalán",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70233",
      "municipio": "El Roble",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70235",
      "municipio": "Galeras",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70265",
      "municipio": "Guaranda",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70400",
      "municipio": "La Unión",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70418",
      "municipio": "Los Palmitos",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70429",
      "municipio": "Majagual",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70473",
      "municipio": "Morroa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70508",
      "municipio": "Ovejas",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70523",
      "municipio": "Palmito",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70670",
      "municipio": "Sampués",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70678",
      "municipio": "San Benito Abad",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70702",
      "municipio": "San Juan de Betulia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70708",
      "municipio": "San Marcos",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70713",
      "municipio": "San Onofre",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70717",
      "municipio": "San Pedro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70742",
      "municipio": "San Luis de Sincé",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70771",
      "municipio": "Sucre",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70820",
      "municipio": "Santiago de Tolú",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre",
      "divipolam": "70823",
      "municipio": "Tolú Viejo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73001",
      "municipio": "Ibagué",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73024",
      "municipio": "Alpujarra",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73026",
      "municipio": "Alvarado",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73030",
      "municipio": "Ambalema",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73043",
      "municipio": "Anzoátegui",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73055",
      "municipio": "Armero",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73067",
      "municipio": "Ataco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73124",
      "municipio": "Cajamarca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73148",
      "municipio": "Carmen de Apicalá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73152",
      "municipio": "Casabianca",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73168",
      "municipio": "Chaparral",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73200",
      "municipio": "Coello",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73217",
      "municipio": "Coyaima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73226",
      "municipio": "Cunday",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73236",
      "municipio": "Dolores",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73268",
      "municipio": "Espinal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73270",
      "municipio": "Falan",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73275",
      "municipio": "Flandes",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73283",
      "municipio": "Fresno",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73319",
      "municipio": "Guamo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73347",
      "municipio": "Herveo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73349",
      "municipio": "Honda",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73352",
      "municipio": "Icononzo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73408",
      "municipio": "Lérida",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73411",
      "municipio": "Líbano",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73443",
      "municipio": "Mariquita",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73449",
      "municipio": "Melgar",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73461",
      "municipio": "Murillo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73483",
      "municipio": "Natagaima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73504",
      "municipio": "Ortega",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73520",
      "municipio": "Palocabildo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73547",
      "municipio": "Piedras",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73555",
      "municipio": "Planadas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73563",
      "municipio": "Prado",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73585",
      "municipio": "Purificación",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73616",
      "municipio": "Rioblanco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73622",
      "municipio": "Roncesvalles",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73624",
      "municipio": "Rovira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73671",
      "municipio": "Saldaña",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73675",
      "municipio": "San Antonio",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73678",
      "municipio": "San Luis",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73686",
      "municipio": "Santa Isabel",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73770",
      "municipio": "Suárez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73854",
      "municipio": "Valle de San Juan",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73861",
      "municipio": "Venadillo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73870",
      "municipio": "Villahermosa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima",
      "divipolam": "73873",
      "municipio": "Villarica",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76001",
      "municipio": "Cali",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76020",
      "municipio": "Alcalá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76036",
      "municipio": "Andalucía",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76041",
      "municipio": "Ansermanuevo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76054",
      "municipio": "Argelia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76100",
      "municipio": "Bolívar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76109",
      "municipio": "Buenaventura",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76111",
      "municipio": "Guadalajara de Buga",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76113",
      "municipio": "Bugalagrande",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76122",
      "municipio": "Caicedonia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76126",
      "municipio": "Calima",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76130",
      "municipio": "Candelaria",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76147",
      "municipio": "Cartago",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76233",
      "municipio": "Dagua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76243",
      "municipio": "El Águila",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76246",
      "municipio": "El Cairo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76248",
      "municipio": "El Cerrito",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76250",
      "municipio": "El Dovio",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76275",
      "municipio": "Florida",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76306",
      "municipio": "Ginebra",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76318",
      "municipio": "Guacarí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76364",
      "municipio": "Jamundí",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76377",
      "municipio": "La Cumbre",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76400",
      "municipio": "La Unión",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76403",
      "municipio": "La Victoria",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76497",
      "municipio": "Obando",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76520",
      "municipio": "Palmira",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76563",
      "municipio": "Pradera",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76606",
      "municipio": "Restrepo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76616",
      "municipio": "Riofrío",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76622",
      "municipio": "Roldanillo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76670",
      "municipio": "San Pedro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76736",
      "municipio": "Sevilla",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76823",
      "municipio": "Toro",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76828",
      "municipio": "Trujillo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76834",
      "municipio": "Tuluá",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76845",
      "municipio": "Ulloa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76863",
      "municipio": "Versalles",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76869",
      "municipio": "Vijes",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76890",
      "municipio": "Yotoco",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76892",
      "municipio": "Yumbo",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca",
      "divipolam": "76895",
      "municipio": "Zarzal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81001",
      "municipio": "Arauca",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81065",
      "municipio": "Arauquita",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81220",
      "municipio": "Cravo Norte",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81300",
      "municipio": "Fortul",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81591",
      "municipio": "Puerto Rondón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81736",
      "municipio": "Saravena",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca",
      "divipolam": "81794",
      "municipio": "Tame",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85001",
      "municipio": "Yopal",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85010",
      "municipio": "Aguazul",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85015",
      "municipio": "Chameza",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85125",
      "municipio": "Hato Corozal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85136",
      "municipio": "La Salina",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85139",
      "municipio": "Maní",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85162",
      "municipio": "Monterrey",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85225",
      "municipio": "Nunchía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85230",
      "municipio": "Orocué",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85250",
      "municipio": "Paz de Ariporo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85263",
      "municipio": "Pore",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85279",
      "municipio": "Recetor",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85300",
      "municipio": "Sabanalarga",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85315",
      "municipio": "Sácama",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85325",
      "municipio": "San Luis de Palenque",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85400",
      "municipio": "Támara",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85410",
      "municipio": "Tauramena",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85430",
      "municipio": "Trinidad",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare",
      "divipolam": "85440",
      "municipio": "Villanueva",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86001",
      "municipio": "Mocoa",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86219",
      "municipio": "Colón",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86320",
      "municipio": "Orito",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86568",
      "municipio": "Puerto Asís",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86569",
      "municipio": "Puerto Caicedo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86571",
      "municipio": "Puerto Guzmán",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86573",
      "municipio": "Leguízamo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86749",
      "municipio": "Sibundoy",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86755",
      "municipio": "San Francisco",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86757",
      "municipio": "San Miguel",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86760",
      "municipio": "Santiago",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86865",
      "municipio": "Valle del Guamuez",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo",
      "divipolam": "86885",
      "municipio": "Villagarzón",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "88",
      "departamento": "Archipiélago de San Andrés, Providencia y Santa Catalina",
      "divipolam": "88001",
      "municipio": "San Andrés",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "88",
      "departamento": "Archipiélago de San Andrés, Providencia y Santa Catalina",
      "divipolam": "88564",
      "municipio": "Providencia",
      "marcacionCredito": {
        "idClasificacion": 2,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Urbano",
        "subTipo": "Urbano"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91001",
      "municipio": "Leticia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91263",
      "municipio": "El Encanto",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91405",
      "municipio": "La Chorrera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91407",
      "municipio": "La Pedrera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91430",
      "municipio": "La Victoria",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91460",
      "municipio": "Miriti - Paraná",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91530",
      "municipio": "Puerto Alegría",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91536",
      "municipio": "Puerto Arica",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91540",
      "municipio": "Puerto Nariño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91669",
      "municipio": "Puerto Santander",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas",
      "divipolam": "91798",
      "municipio": "Tarapacá",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94001",
      "municipio": "Inírida",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94343",
      "municipio": "Barranco Minas",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94663",
      "municipio": "Mapiripana",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94883",
      "municipio": "San Felipe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94884",
      "municipio": "Puerto Colombia",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94885",
      "municipio": "La Guadalupe",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94886",
      "municipio": "Cacahual",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94887",
      "municipio": "Pana Pana",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía",
      "divipolam": "94888",
      "municipio": "Morichal",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "95",
      "departamento": "Guaviare",
      "divipolam": "95001",
      "municipio": "San José del Guaviare",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "95",
      "departamento": "Guaviare",
      "divipolam": "95015",
      "municipio": "Calamar",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "95",
      "departamento": "Guaviare",
      "divipolam": "95025",
      "municipio": "El Retorno",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "95",
      "departamento": "Guaviare",
      "divipolam": "95200",
      "municipio": "Miraflores",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97001",
      "municipio": "Mitú",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97161",
      "municipio": "Caruru",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97511",
      "municipio": "Pacoa",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97666",
      "municipio": "Taraira",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97777",
      "municipio": "Papunaua",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés",
      "divipolam": "97889",
      "municipio": "Yavaraté",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "99",
      "departamento": "Vichada",
      "divipolam": "99001",
      "municipio": "Puerto Carreño",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "99",
      "departamento": "Vichada",
      "divipolam": "99524",
      "municipio": "La Primavera",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "99",
      "departamento": "Vichada",
      "divipolam": "99624",
      "municipio": "Santa Rosalía",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    },
    {
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "99",
      "departamento": "Vichada",
      "divipolam": "99773",
      "municipio": "Cumaribo",
      "marcacionCredito": {
        "idClasificacion": 1,
        "id": 0,
        "clasificacion": "ND",
        "tipo": "Rural",
        "subTipo": "Rural"
      }
    }
  ]
}

export const Departamentos = {
  "_id": "6f95360a441ba953567fc6e3b828225c",
  "_rev": "2-c809e662810595a8e57e7f155c43abea",
  "coleccion": "departamentos",
  "data": [
    {
      "id": 1,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "05",
      "departamento": "Antioquia"
    },
    {
      "id": 2,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "08",
      "departamento": "Atlántico"
    },
    {
      "id": 3,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "11",
      "departamento": "Bogotá"
    },
    {
      "id": 4,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "13",
      "departamento": "Bolívar"
    },
    {
      "id": 5,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "15",
      "departamento": "Boyacá"
    },
    {
      "id": 6,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "17",
      "departamento": "Caldas"
    },
    {
      "id": 7,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "18",
      "departamento": "Caquetá"
    },
    {
      "id": 8,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "19",
      "departamento": "Cauca"
    },
    {
      "id": 9,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "20",
      "departamento": "Cesar"
    },
    {
      "id": 10,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "23",
      "departamento": "Córdoba"
    },
    {
      "id": 11,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "25",
      "departamento": "Cundinamarca"
    },
    {
      "id": 12,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "27",
      "departamento": "Chocó"
    },
    {
      "id": 13,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "41",
      "departamento": "Huila"
    },
    {
      "id": 14,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "44",
      "departamento": "La Guajira"
    },
    {
      "id": 15,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "47",
      "departamento": "Magdalena"
    },
    {
      "id": 16,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "50",
      "departamento": "Meta"
    },
    {
      "id": 17,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "52",
      "departamento": "Nariño"
    },
    {
      "id": 18,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "54",
      "departamento": "Norte de Santander"
    },
    {
      "id": 19,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "63",
      "departamento": "Quindío"
    },
    {
      "id": 20,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "66",
      "departamento": "Risaralda"
    },
    {
      "id": 21,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "68",
      "departamento": "Santander"
    },
    {
      "id": 22,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "70",
      "departamento": "Sucre"
    },
    {
      "id": 23,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "73",
      "departamento": "Tolima"
    },
    {
      "id": 24,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "76",
      "departamento": "Valle del Cauca"
    },
    {
      "id": 25,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "81",
      "departamento": "Arauca"
    },
    {
      "id": 26,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "85",
      "departamento": "Casanare"
    },
    {
      "id": 27,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "86",
      "departamento": "Putumayo"
    },
    {
      "id": 28,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "88",
      "departamento": "Archipiélago de San Andrés, Providencia y Santa Catalina"
    },
    {
      "id": 29,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "91",
      "departamento": "Amazonas"
    },
    {
      "id": 30,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "94",
      "departamento": "Guainía"
    },
    {
      "id": 31,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "95",
      "departamento": "Guaviare"
    },
    {
      "id": 32,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "97",
      "departamento": "Vaupés"
    },
    {
      "id": 33,
      "codigoContinente": "06",
      "continente": "SUDAMERICA",
      "codigoPais": "343",
      "pais": "COLOMBIA",
      "divipolad": "99",
      "departamento": "Vichada"
    }
  ]
}