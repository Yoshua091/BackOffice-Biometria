export interface Dispersion {
    estado:        Estado;
    _id:           string;
    nombreArchivo: string;
    pab:           Pab;
    usuario:       Usuario;
    avance:        number;
    registros:     number;
    errores:       number;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}

export interface Estado {
    id:     number;
    estado: string;
}

export interface Pab {
    tipoRegistro:          string;
    nitEntidad:            string;
    aplicacion:            string;
    filler:                string;
    claseTransaccion:      string;
    descripcionProposito:  string;
    fechaTransmision:      string;
    secuenciaEnvio:        string;
    fechaAplicacion:       string;
    numeroRegistros:       string;
    sumatoriaDebitos:      string;
    sumatoriaCreditos:     string;
    cuentaClianteADebitar: string;
    tipoCuentaCliente:     string;
    filler1:               string;
}

export interface Historico {
    estado:        Estado;
    _id:           string;
    nombreArchivo: string;
    usuario:       Usuario;
    avance:        number;
    errores:       number;
    total:         number;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}

export interface Usuario {
    _id:       string;
    idUsuario: string;
    nombre:    string;
    apellido:  string;
    iat:       number;
    exp:       number;
}

export interface DetalleHistorico {
    estado:        Estado;
    _id:           string;
    nombreArchivo: string;
    usuario:       Usuario;
    avance:        number;
    registros:     Registro[];
    errores:       number;
    total:         number;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
}

export interface Estado {
    id:     number;
    estado: string;
}

export interface Registro {
    estado:                       Estado;
    fecha_de_transmision:         Date;
    documento_beneficiario:       number;
    nombre_beneficiario:          string;
    banco_cuenta_beneficiario:    number;
    numero_cuenta_beneficiario:   number;
    valor:                        number;
    codigo_resultado:             string;
    descripcion_codigo_resultado: string;
    numero_de_cheque:             number;
    fecha_aplicacion:             Date;
}

export interface Usuario {
    _id:       string;
    idUsuario: string;
    nombre:    string;
    apellido:  string;
    iat:       number;
    exp:       number;
}


export interface DetallePAB {
    estado:        Estado;
    _id:           string;
    nombreArchivo: string;
    pab:           Pab;
    usuario:       Usuario;
    avance:        number;
    createdAt:     Date;
    updatedAt:     Date;
    __v:           number;
    errores:       number;
    registros:     number;
}

export interface Pab {
    tipoRegistro:          string;
    nitEntidad:            string;
    aplicacion:            string;
    filler:                string;
    claseTransaccion:      string;
    descripcionProposito:  string;
    fechaTransmision:      string;
    secuenciaEnvio:        string;
    fechaAplicacion:       string;
    numeroRegistros:       string;
    sumatoriaDebitos:      string;
    sumatoriaCreditos:     string;
    cuentaClianteADebitar: string;
    tipoCuentaCliente:     string;
    filler1:               string;
    registros:             RegistroPAB[];
}

export interface RegistroPAB {
    tipoRegistro:                      string;
    nitBeneficiario:                   string;
    nombreBeneficiario:                string;
    bancoCuentaBeneficiario:           string;
    numeroCuentaBeneficiario:          string;
    lugarDePago:                       string;
    tipoTransaccion:                   string;
    valorTransaccion:                  string;
    fechaAplicacion:                   string;
    referencia:                        string;
    tipoDocIdentidad:                  string;
    oficinaEntrega:                    string;
    numeroFax:                         string;
    email:                             string;
    numeroIdentificacionDelAutorizado: string;
    filler:                            string;
    estado:                            Estado;
}