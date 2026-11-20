export interface Renovacion {
    lista: Lista[];
    total: number;
}

export interface Lista {
    usuario:      Usuario;
    validacion:   Validacion;
    _id:          string;
    numRegistros: number;
    archivo:      string;
    error:        any[];
    estado:       number;
    avance:       number;
    errorProceso: number;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}

export interface Usuario {
    _id:       string;
    idUsuario: string;
    nombre:    string;
    apellido:  string;
}

export interface Validacion {
    proceso:   number;
    correctos: number;
    error:     number;
    mensaje:   string;
}


export interface Lote {
    usuario:      Usuario;
    validacion:   Validacion;
    _id:          string;
    numRegistros: number;
    archivo:      string;
    registros:    Registro[];
    error:        any[];
    estado:       number;
    avance:       number;
    errorProceso: number;
    createdAt:    Date;
    updatedAt:    Date;
    __v:          number;
}

export interface Registro {
    idSolicitud:          string;
    estado:               number;
    pavance:              number;
    saldo:                number;
    tipoRenovacion:       string;
    porcentajeRenovacion: number;
    montoPreaprobado:     number;
    vigencia:             Date;
    log:                  string;
    procesado:            number;
    index:                number;
    cambioMiembros:       boolean;
    linea:                string;
    _id:                  string;
    fecha:                Date;
}