import {Pipe, PipeTransform} from '@angular/core';
import {Cliente} from '../entities/solicitudes';

@Pipe({
  name: 'buscarCliente'
})
export class BuscarClientePipe implements PipeTransform {

  campoBusqueda: { [k: string]: (clientes: Cliente[], valor: any) => Cliente } = {
    // tslint:disable-next-line:max-line-length
    numeroIdentificacion: (clientes: Cliente[], valor: any) => clientes?.find(c => c.datosIdentificacionCliente?.numeroIdentificacion === valor),
    tipoMiembro: (clientes: Cliente[], valor: number) => clientes?.find(c => c.tipoMiembro?.id === valor)
  };

  transform(clientes: Cliente[], campo: 'numeroIdentificacion' | 'tipoMiembro', valor: unknown): Cliente {

    if (clientes && campo) {
      return this.campoBusqueda[campo](clientes, valor);
    }

    return null;
  }

}
