import { Pipe, PipeTransform } from '@angular/core';
import {CIIUSubsector} from '../entities/solicitudes';

@Pipe({
  name: 'detalleMetodos'
})
export class DetalleMetodosPipe implements PipeTransform {

  transform(value: any, metodo: MontoVentasKeys, ciiu?: CIIUSubsector, ...args: unknown[]): any {
    return metodo === MontoVentasKeys.COMPRAS_PROVEEDORES ?
      ResultadoVentas[metodo](value[metodo], ciiu) :
      ResultadoVentas[metodo](value[metodo]);
  }

}

@Pipe({
  name: 'mostrarDetalleMetodos'
})
export class MostrarDetalleMetodosPipe implements PipeTransform {

  transform(value: any, metodo: MontoVentasKeys, ciiu?: CIIUSubsector, ...args: unknown[]): boolean {
    const detalle = metodo === MontoVentasKeys.COMPRAS_PROVEEDORES ?
      ResultadoVentas[metodo](value[metodo], ciiu) :
      ResultadoVentas[metodo](value[metodo]);

    return typeof detalle === 'object' ? Object.keys(detalle).some(k => !!detalle[k]) : !!detalle;
  }

}

const ventasMensualesDBM = (diasBuenosMalos: any) => {
  const totalSemanal =
    parseInt(diasBuenosMalos.numeroDiasBuenos, 10) * parseInt(diasBuenosMalos.ventasEnUnDiaBueno, 10) +
    parseInt(diasBuenosMalos.numeroDiasRegulares, 10) * parseInt(diasBuenosMalos.ventasEnUnDiaRegular, 10) +
    parseInt(diasBuenosMalos.numeroDiasMalos, 10) * parseInt(diasBuenosMalos.ventasEnUnDiaMalo, 10) || 0;

  const sumaDias = parseInt(diasBuenosMalos.numeroDiasBuenos, 10) +
    parseInt(diasBuenosMalos.numeroDiasRegulares, 10) +
    parseInt(diasBuenosMalos.numeroDiasMalos, 10);

  return {
    totalmensual: sumaDias <= 7 ? totalSemanal * 4 : 0,
    totalDiasSemana: sumaDias ? sumaDias : 0
  };

};

const ventasMensualesVPP = ({periodicidadVentasPeriodo, ventas}: any) => {
  const {id} = periodicidadVentasPeriodo || {};
  return ventas && id ? parseInt(ventas, 10) * parseInt(id, 10) : 0;
};

const ventasMensualesRCProvedores = (relacionComprasProveedores, ciiu: CIIUSubsector) => {

  if (!ciiu) {
    throw new Error(`Error DetalleMetodosPipe: se necesita el codigo ciiu para el metodo relacionComprasProveedores`);
  }

  const {
    vecesAlMesProveedor1,
    vecesAlMesProveedor2,
    vecesAlMesProveedor3,
    valorPromCompraProveedor1,
    valorPromCompraProveedor2,
    valorPromCompraProveedor3
  } = relacionComprasProveedores;
  const totalProveedor = (vecesAlMes, valorPromCompra) => parseInt(vecesAlMes, 10) * parseInt(valorPromCompra, 10) || 0;
  const totalproveedor1 = totalProveedor(vecesAlMesProveedor1, valorPromCompraProveedor1);
  const totalproveedor2 = totalProveedor(vecesAlMesProveedor2, valorPromCompraProveedor2);
  const totalproveedor3 = totalProveedor(vecesAlMesProveedor3, valorPromCompraProveedor3);
  const promedioLimiteCompras = (parseInt(ciiu.limiteMinimo, 10) + parseInt(ciiu.limiteMaximo, 10)) / 2 || 0;
  const margenBruto = promedioLimiteCompras / 100;
  const costoVenta = 1 - margenBruto;
  const totalproveedores = costoVenta > 0 ? Math.floor((totalproveedor1 + totalproveedor2 + totalproveedor3) / costoVenta) : 0;

  return {
    totalproveedor1,
    totalproveedor2,
    totalproveedor3,
    totalproveedores
  };

};

const ventasMensualesRV = ({semanaAnterior, semanaActual}: any) => {
  const totalSemanaAnterior = Object.keys(semanaAnterior).reduce((sum, k) => parseInt(semanaAnterior[k], 10) + sum, 0);
  const totalSemanaActual = Object.keys(semanaActual).reduce((sum, k) => parseInt(semanaActual[k], 10) + sum, 0);
  const totalMensual = (totalSemanaAnterior + totalSemanaActual) * 2;

  return {
    totalSemanaAnterior,
    totalSemanaActual,
    totalMensual
  };

};

const ResultadoVentas = {
  relacionComprasProveedores: ventasMensualesRCProvedores,
  registroDeVentas: ventasMensualesRV,
  diasBuenosMalos: ventasMensualesDBM,
  ventasPorPeriodo: ventasMensualesVPP,
};

export enum MontoVentasKeys {
  REGISTROS_VENTAS = 'registroDeVentas',
  BUENOS_MALOS = 'diasBuenosMalos',
  POR_PERIODO = 'ventasPorPeriodo',
  COMPRAS_PROVEEDORES = 'relacionComprasProveedores',
}
