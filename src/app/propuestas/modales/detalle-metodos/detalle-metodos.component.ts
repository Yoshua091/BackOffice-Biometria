import {Component, OnInit} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {CIIUSubsector, MontoVentas} from '../../../core/entities/solicitudes';
import {MontoVentasKeys} from '../../../core/pipes/detalle-metodos.pipe';

const {REGISTROS_VENTAS, BUENOS_MALOS, POR_PERIODO, COMPRAS_PROVEEDORES} = MontoVentasKeys;

@Component({
  selector: 'app-detalle-metodos',
  templateUrl: './detalle-metodos.component.html',
  styleUrls: ['./detalle-metodos.component.scss']
})
export class DetalleMetodosComponent implements OnInit {

  titulosModal: {[k: string]: string} = {};
  montoVentasKeys = {REGISTROS_VENTAS, BUENOS_MALOS, POR_PERIODO, COMPRAS_PROVEEDORES};
  montoVentas: MontoVentas = {} as MontoVentas;
  ciiu: CIIUSubsector = {} as CIIUSubsector;

  constructor(public modal: NgbActiveModal) {
    this.titulosModal[REGISTROS_VENTAS] = 'Registro de ventas';
    this.titulosModal[BUENOS_MALOS] = 'Días buenos, regulares y malos';
    this.titulosModal[POR_PERIODO] = 'Ventas por periodo';
    this.titulosModal[COMPRAS_PROVEEDORES] = 'Relación con proveedores';
  }

  ngOnInit(): void {
  }

}
