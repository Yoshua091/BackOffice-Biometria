export class LotesDispersion {
    archivo: string;
    canal: number;
    createdAt: string;
    updatedAt: string;
    _id: string;
    __v: number;
    ciclo: Ciclo;
    envio: Envio;
    estado: Estado;
    respuesta: Respuesta;
}


export class Ciclo {
    hora: string;
    id: number;
}

export class Envio {
    fecha: string;
    registros: RegistrosIdentificacion[];
    status: {
        numeroRegistros: number;
    }
}

export class Estado {
    estado: string;
    id: number;
}

export class Respuesta {
    registros: Registros[];
    status:{
        errores: number;
        numeroRegistros: number;
        procesados: number;
    }
}

export class Registros {
    numeroIdentificacion: number;
    referencia: string;
    _id: string;
    estadoProceso: {
        codigo: string;
        descripcion: string;
        id: number;
    }
}

export class RegistrosIdentificacion {
    apellidos: string;
    monto: number;
    nombres: string;
    numeroIdentificacion: number;
    referencia: string;
    tipoIdentificacion: number;
    _id: string;
}