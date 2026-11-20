export class transferirSolicitud {
    zonaOrigen: string;
    zonaDestino: string;
    motivo: string;
}


export class transferirSolicitudBuscar {
    id: string;
    zonaOrigen: {
        _id: string;
        _rev: string
        usuario_id: string;
        nombre: string;
        sucursal_id: string;
        estado: number;
    };
    zonaDestino: {
        _id: string;
        _rev: string
        usuario_id: string;
        nombre: string;
        sucursal_id: string;
        estado: number;
    };
    motivo: string;
    estado: number;
    usuarioRegistra: {
        _id: string;
        idUsuario: string;
        nombre: string;
        apellido: string
        rol: {
            _id: string;
            _rev: string;
            id: number;
            rol: string;
            estado: 1
        };
        perfil: {
            _id: string;
            _rev: string;
            id: number
            perfil: string;
            estado: number;
        };
        sucursal: {
            _id: string
            _rev: string;
            nombre: string;
            direccion: string;
            telefono: string;
            idSucursal: string;
        };
        iat: string;
        exp: string;
    };
    eventos: [
        {
            fecha: string;
            evento: string;
        }
    ];
    fecha: string;
    solicitudesOrigen: [];
    __v: number;
}