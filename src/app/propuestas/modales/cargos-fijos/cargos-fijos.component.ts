import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cargos-fijos',
  templateUrl: './cargos-fijos.component.html',
  styleUrls: ['./cargos-fijos.component.scss']
})
export class CargosFijosComponent implements OnInit {
  @Input() resultadoSimulador: any;
  @Input() solicitud: any
  @Input() soat: any

  fechaActual: Date = new Date();
  constructor(public modal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

  calcularMontoPrestamo(): number {
    const miembros = this.solicitud?.miembros || [];
    const saldo = this.solicitud?.renovacion?.saldo || 0;

    const totalMonto = miembros.reduce((total, miembro) => {
      const monto = miembro.solicitudEconomica?.valoresDetalles?.monto || 0;
      return total + parseFloat(monto);
    }, 0);

    return totalMonto + saldo; 
  }

  mostrarMontoSolicitado(): number {
    const miembros = this.solicitud?.miembros || [];

    const totalMonto = miembros.reduce((total, miembro) => {
      const monto = miembro.solicitudEconomica?.valoresDetalles?.monto || 0;
      return total + parseFloat(monto);
    }, 0);

    return totalMonto;
  }

  mostrarValorSoat(): number {
    debugger
    const miembros = this.solicitud?.miembros || [];

    const montoSoat = miembros[0]?.desembolso?.seguroSoat?.[0]?.resultadoSoat?.data?.cotizacionSeleccionada?.valorTotal || 0

    return montoSoat;
  }
  
  mostrarTotalSolicitadoMasSoat(): number {
    return this.mostrarMontoSolicitado() + this.mostrarValorSoat();
  }

}
