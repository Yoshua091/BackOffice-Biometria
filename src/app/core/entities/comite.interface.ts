export interface ComiteInterface {
    usuarioAsignado: UsuarioAsignado;
    fechaAsignacion: Date;
}

export interface UsuarioAsignado {
    _id:          string;
    _rev:         string;
    nombre:       string;
    apellido:     string;
    cedula:       string;
    rol:          Rol;
    usuario:      string;
    codigoAsesor: number;
    sucursal:     Sucursal;
    perfil:       Perfil;
    idUsuario:    string;
    clave:        string;
    estado:       number;
    updatedAt:    Date;
}

export interface Perfil {
    _id:    string;
    _rev:   string;
    id:     number;
    perfil: string;
    estado: number;
}

export interface Rol {
    _id:               string;
    _rev:              string;
    id:                number;
    rol:               string;
    menu:              any[];
    estado:            number;
    permisosEjecucion: any[];
}

export interface Sucursal {
    _id:        string;
    nombre:     string;
    idSucursal: string;
}
