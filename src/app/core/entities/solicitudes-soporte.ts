export interface SolicitudesSoporte {
    _id: string;
    _rev: string;
    tipoSolicitud: Tipo;
    idSolicitud: string;
    estado: number;
    secuencia: number;
    fechaCreacionSolicitud: Date;
    createdAt: Date;
    updatedAt: Date;
    fechaRecepcion: Date;
    fechaSimulacion: Date;
    miembros: Miembro[];
    historialCambioMontoPrestamo: any[];
    usuarioRegistra: UsuarioRegistra;
    sucursal: Sucursal;
    chat: any[];
    fotos: Foto[];
    sincronizar: number;
    pagare: string;
    log: any[];
    siif: any;
    fechaCredito: string;
    apkVersion: string;
    soporte: Soporte;
    zona: Zona;
    type: string;
    backup: number;
    sincMongoDB: number;
    sincFotos: number;
    logEstados: any[];
    _attachments: { [key: string]: Attachment };
}

export interface Attachment {
    content_type: ContentType;
    revpos: number;
    digest: string;
    length: number;
    stub: boolean;
}

export enum ContentType {
    ImagePNG = "image/png",
}

export interface Foto {
    id: number;
    Nombreid: string;
    nombre: string;
    keyNombre: string;
    extension: Extension;
    orientacion: number;
    ruta: string;
    createdAt?: Date;
    updatedAt?: Date;
    latitud?: string;
    logintud?: string;
    tooltip: string;
    aprobada: number;
    mensajeRechazo: string;
    sincFoto: number;
}

export enum Extension {
    ImageJpg = "image/jpg",
}

export interface Miembro {
    estudioPreselecta: EstudioPreselecta;
    tipoMiembro: Tipo;
    renovacionMiembro: RenovacionMiembro;
    datosCoodeudorAsalariado: DatosCoodeudorAsalariado;
    datosPersonalesCliente: DatosPersonalesCliente;
    datosIdentificacionCliente: DatosIdentificacionCliente;
    datosCodeudor: DatosCodeudor;
    datosConyugue: DatosConyugue;
    datosContactoCliente: DatosContactoCliente;
    referenciasCliente: ReferenciasCliente;
    datosComerciales: DatosComerciales;
    encuestaSocioEconomica: MiembroEncuestaSocioEconomica;
    solicitudEconomica: SolicitudEconomica;
    desembolso: Desembolso;
    seguro: any[];
    fotos: { [key: string]: number | null };
    aprobacion: Aprobacion;
    preguntasReferenciasLaborales: any[];
    otp: Otp;
    declaracionFondos: DeclaracionFondos;
    autorizaciones: Autorizaciones;
    solicitudFormValidate: SolicitudFormValidate;
    preguntasArriendoLocal: any[];
    preguntasArriendoVivienda: any[];
    type: string;
}

export interface Aprobacion {
    aprobacionReferenciasLaborales: boolean;
    clienteExperto: boolean;
    fotos: boolean;
    firmas: boolean;
    historial: boolean;
    referenciasArriendoLocal: boolean;
    referenciasArriendoVivienda: boolean;
    documentos: boolean;
    log: any[];
}

export interface Autorizaciones {
    smsWhatsapp: boolean;
}

export interface DatosCodeudor {
    parentescoConTitular: ParentescoConTitular;
}

export interface ParentescoConTitular {
    id: number;
    parentesco: string;
}

export interface DatosComerciales {
    nombreEstablecimiento: string;
    telefonoComercial: number;
    CIIUSector: CIIUSector;
    CIIUSubSector: CIIUSubSector;
    negocioEnVivienda: boolean;
    ambulante: boolean;
    ambulanteConUbicacionFIja: boolean;
    location: Location;
    pais: PaisClass;
    departamento: Ciudad;
    ciudad: Ciudad;
    barrio: string;
    direccion: string;
    indicaciones: string;
    numeroEmpleados: number;
    tiempoExpDesarrollandoActividad: number;
    tiempoEnLugarActual: number;
}

export interface CIIUSector {
    seccion: string;
    descripcionSeccion: string;
    macroSector: string;
    descripcionMacroSector: string;
}

export interface CIIUSubSector {
    seccion: string;
    descripcionSeccion: string;
    macroSector: string;
    descripcionMacroSector: string;
    subSector: string;
    descripcionSubSector: string;
    actividad: string;
    descripcionActividad: string;
    limiteMinimo: string;
    limiteMaximo: string;
    tipoNegocio: string;
}

export interface Ciudad {
    id?: number;
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
    divipolad: string;
    departamento: string;
    divipolam?: string;
    municipio?: string;
}

export interface Location {
    lon: number;
    lat: number;
}

export interface PaisClass {
    codigoContinente: string;
    continente: string;
    codigoPais: string;
    pais: string;
}

export interface DatosContactoCliente {
    telefono: number;
    telefono1: number;
    email: string;
    direccion: string;
    pais: PaisClass;
    departamento: Ciudad;
    ciudad: Ciudad;
    barrio: string;
    indicaciones: string;
    location: Location;
    estrato: Estrato;
}

export interface Estrato {
    id: number;
    estrato: number;
}

export interface DatosConyugue {
    nombres: string;
    apellidos: string;
    genero: Genero;
    tipoIdentificacion: TipoIdentificacion;
    numeroIdentificacion: number;
    telefono: number;
    ocupacion: Ocupacion;
    empresaDondeTrabaja: string;
    pais: PaisClass;
    departamento: Ciudad;
    ciudad: Ciudad;
    ingresoMensual: number;
}

export interface Genero {
    id: number;
    genero: string;
}

export interface Ocupacion {
    id: number;
    ocupacion: string;
}

export interface TipoIdentificacion {
    id: number;
    detalle: string;
    tipo: string;
}

export interface DatosCoodeudorAsalariado {
    informacionLaboral: InformacionLaboral;
    encuestaSocioEconomica: DatosCoodeudorAsalariadoEncuestaSocioEconomica;
}

export interface DatosCoodeudorAsalariadoEncuestaSocioEconomica {
    ingresosDelCliente: PurpleIngresosDelCliente;
    gastosDelCliente: GastosDelCliente;
    activo: PurpleActivo;
    pasivo: PurplePasivo;
}

export interface PurpleActivo {
    efectivoBancos: number;
    cuentasPorCobrar: number;
    inmuebles: number;
    activosHogar: number;
}

export interface GastosDelCliente {
    alimentacion: number;
    arriendo: number;
    transporte: number;
    servicios: number;
    educacion: number;
    salud: number;
    otrosGastos: number;
    deudasTerceros: number;
}

export interface PurpleIngresosDelCliente {
    otrosIngresos: OtrosIngresos;
    monto: number;
    sueldo: number;
}

export interface OtrosIngresos {
    id: number;
    ingreso: string;
}

export interface PurplePasivo {
    saldoHipoteca: number;
    deudasTerceros: number;
    deudasSectorFinanciero: number;
    deudasConProspera: number;
}

export interface InformacionLaboral {
    pais: PaisClass;
    departamento: Ciudad;
    ciudad: Ciudad;
    telefono: number;
    antiguedad: number;
    direccion: string;
    estrato: Estrato;
    barrio: string;
    nombreEmpresa: string;
    nombreJefe: string;
    cargo: string;
    tipoContrato: Tipo;
}

export interface Tipo {
    id: number;
    tipo: string;
    plus: boolean;
    premium: boolean;
}

export interface DatosIdentificacionCliente {
    tipoIdentificacion: TipoIdentificacion;
    numeroIdentificacion: number;
    fechaExpedicion: Date;
    departamentoExpedicion: Ciudad;
    ciudadExpedicion: Ciudad;
    paisNacimiento: PaisClass;
    departamentoNacimiento: Ciudad;
    ciudadNacimiento: Ciudad;
}

export interface DatosPersonalesCliente {
    nombre1: string;
    nombre2: string;
    apellido1: string;
    apellido2: string;
    fechaNacimiento: Date;
    genero: Genero;
    nivelEducativo: NivelEducativo;
    tipoDeVivienda: TipoDeVivienda;
    tiempoEnVivienda: number;
    estadoCivil: EstadoCivil;
    tipoDeLocal: TipoDeLocal;
    manejaRecursosPublicos: boolean;
    personaPoliticaExpuesta: boolean;
    operacionesEnMonedaExt: boolean;
    tipoOperacionImportacion: Tipo;
    hijosMenores: boolean;
    numeroHijosMenores: number;
    personasACargo: boolean;
    numeroPersonasACargo: number;
    programaReincorporacion: boolean;
    numeroResolucion: number;
    fechaResolucion: string;
}

export interface EstadoCivil {
    id: number;
    estadoCivil: string;
}

export interface NivelEducativo {
    id: number;
    nivel: string;
}

export interface TipoDeLocal {
    id: number;
    local: string;
    siif: string;
}

export interface TipoDeVivienda {
    id: number;
    tipoVivienda: string;
    siif: string;
}

export interface DeclaracionFondos {
    texto: string;
    comentariosAdicionales: string;
}

export interface Desembolso {
    tipoDesembolso: TipoDesembolso;
    banco: Banco;
    tipoCuenta: TipoCuenta;
    numeroCuenta: string;
}

export interface Banco {
    id: number;
    banco: string;
    codigo: number | string;
    bancolombia?: string;
    costoDesembolso?: number;
}

export interface TipoCuenta {
    id: number;
    tipo: string;
    bancolombia?: number;
}

export interface TipoDesembolso {
    id: number;
    tipo: string;
    costoDesembolso: number;
}

export interface MiembroEncuestaSocioEconomica {
    montoVentas: MontoVentas;
    margenVentasBruto: number;
    costoDeVentas: number;
    gastosMicroEmpresa: GastosMicroEmpresa;
    ingresosDelCliente: FluffyIngresosDelCliente;
    gastosDelCliente: GastosDelCliente;
    activo: FluffyActivo;
    pasivo: FluffyPasivo;
}

export interface FluffyActivo {
    efectivoBancos: number;
    cuentasPorCobrar: number;
    inventarios: number;
    inmuebles: number;
    activosFijos: number;
    vehiculos: number;
}

export interface GastosMicroEmpresa {
    salariosYManoObra: number;
    transporte: number;
    arriendo: number;
    servicios: number;
    cuotasDeCredito: number;
    obligacionesConSectorFinanciero: number;
    otrosGastos: number;
}

export interface FluffyIngresosDelCliente {
    otrosIngresos: OtrosIngresos;
    monto: number;
}

export interface MontoVentas {
    registroDeVentas: RegistroDeVentas;
    diasBuenosMalos: DiasBuenosMalos;
    ventasPorPeriodo: VentasPorPeriodo;
    relacionComprasProveedores: RelacionComprasProveedores;
    ventasMensualPromedio: number;
}

export interface DiasBuenosMalos {
    numeroDiasBuenos: number;
    ventasEnUnDiaBueno: number;
    numeroDiasRegulares: number;
    ventasEnUnDiaRegular: number;
    numeroDiasMalos: number;
    ventasEnUnDiaMalo: number;
}

export interface RegistroDeVentas {
    tieneRegistro: boolean;
    semanaAnterior: SemanaA;
    semanaActual: SemanaA;
}

export interface SemanaA {
    lunes: number;
    martes: number;
    miercoles: number;
    jueves: number;
    viernes: number;
    sabado: number;
    domingo: number;
}

export interface RelacionComprasProveedores {
    vecesAlMesProveedor1: number;
    valorPromCompraProveedor1: number;
    vecesAlMesProveedor2: number;
    valorPromCompraProveedor2: number;
    vecesAlMesProveedor3: number;
    valorPromCompraProveedor3: number;
}

export interface VentasPorPeriodo {
    ventas: number;
    periodicidadVentasPeriodo: PeriodicidadVentasPeriodo;
}

export interface PeriodicidadVentasPeriodo {
    id: number;
    periodo: string;
}

export interface FluffyPasivo {
    proveedores: number;
    anticipoClientes: number;
    saldoHipoteca: number;
    deudasTerceros: number;
    deudasInstitucion: number;
    deudasSectorFinanciero: number;
    deudasConProspera: number;
}

export interface EstudioPreselecta {
    estudio: boolean;
    aprobado: boolean;
    resultado: string;
}

export interface Otp {
    validadoGerente: boolean;
    validadoOtp: boolean;
    intentosOtp: any[];
}

export interface ReferenciasCliente {
    nombreReferenciaZonal: string;
    telefono: number;
    nombreArrendador: string;
    telefonoArrendador: number;
    nombreArrendadorLocal: string;
    telefonoArrendadorLocal: number;
    nombreDueno: string;
    tiempoFuncionando: number;
    buenVecino: string;
}

export interface RenovacionMiembro {
    nuevoMiembro: boolean;
}

export interface SolicitudEconomica {
    valoresDetalles: ValoresDetalles;
}

export interface ValoresDetalles {
    monto: number;
    montoAnterior: number;
    plazoAnterior: number;
    historialCambio: any[];
    plazoMeses: PlazoMeses;
    destinoPrestamo: DestinoPrestamo;
    DetalleDestinoCredito: string;
    tipoProducto: TipoProducto;
    tipoGarantia: TipoGarantia;
    fechaPago: FechaPago;
}

export interface DestinoPrestamo {
    idDestino: number;
    destino: string;
}

export interface FechaPago {
    idDia: number;
    dia: number;
}

export interface PlazoMeses {
    idPlazo: number;
    meses: number;
}

export interface TipoGarantia {
    idGarantia: number;
    garantia: string;
}

export interface TipoProducto {
    idTipo: number;
    tipo: string;
}

export interface SolicitudFormValidate {
    datosCliente: boolean;
    datosComerciales: boolean;
    desembolso: boolean;
    montoPrestado: boolean;
    encuestaSocioEconomica: boolean;
    datosClientePercent: number;
    datosComercialesPercent: number;
    desembolsoPercent: number;
    montoPrestadoPercent: number;
    encuestaSocioEconomicaPercent: number;
}

export interface Soporte {
    createdAt: string;
    soporte: boolean;
}

export interface Sucursal {
    _id: string;
    _rev: string;
    nombre: string;
    direccion: string;
    telefono: string;
    idSucursal: string;
}

export interface UsuarioRegistra {
    _id: string;
    _rev: string;
    nombre: string;
    apellido: string;
    cedula: string;
    rol: Rol;
    usuario: string;
    clave: string;
    codigoAsesor: string;
    sucursal: Sucursal;
    perfil: Perfil;
    lider: boolean;
    idUsuario: string;
    estado: number;
    zona: Zona;
    updatedAt: Date;
    "user-agent": string;
}

export interface Perfil {
    _id: string;
    _rev: string;
    id: number;
    perfil: string;
    estado: number;
}

export interface Rol {
    _id: string;
    _rev: string;
    id: number;
    rol: string;
    menu: any[];
    estado: number;
    permisosEjecucion: any[];
    updatedAt: Date;
}

export interface Zona {
    usuario_id: string;
    nombre: string;
    sucursal_id: string;
    estado: number;
    _id: string;
    _rev: string;
}

