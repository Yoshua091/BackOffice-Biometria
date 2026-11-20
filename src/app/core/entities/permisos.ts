export class Permisos {
    id: number;
    menu: string;
    modulos: Modulos[];
}

export class Modulos {
    id: number;
    modulo: string;
    acciones: Acciones[];
}

export class Acciones {
    id: number;
    accion: string;
}
