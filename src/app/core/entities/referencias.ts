// tslint:disable
export class Referencias {
  _id: string;
  _rev: string;
  pregunta: string;
  tipo: ReferenciaTipo;
  respuestas: string[];
  respuestaCliente: string;
  estado: number;
  lonMax: number;
}

export enum ReferenciaTipo {
  Text = 1,
  Number,
  Select,
}
