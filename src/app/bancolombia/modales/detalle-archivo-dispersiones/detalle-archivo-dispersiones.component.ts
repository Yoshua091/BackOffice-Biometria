import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { DetallePAB, Dispersion, Registro, RegistroPAB } from 'src/app/core/entities/bancolombia.interface';

@Component({
  selector: 'app-detalle-archivo-dispersiones',
  templateUrl: './detalle-archivo-dispersiones.component.html',
  styleUrls: ['./detalle-archivo-dispersiones.component.scss']
})
export class DetalleArchivoDispersionesComponent implements OnInit {

  @Input() element: Dispersion;
  detalle: DetallePAB;
  procesados: RegistroPAB[] = [];
  errores: RegistroPAB[] = [];

  constructor(private api: ApiService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getDetalle()
  }

  async getDetalle() {
    this.detalle = (await this.api.bancolombiaDispersiones.getDetalllePBA(this.element._id)).data;
    this.filtrarRegistros();
  }

  filtrarRegistros() {
    this.detalle.pab.registros.forEach(reg => {
      if (reg.estado.id === 1) {
        this.procesados.push(reg);
      } else {
        this.errores.push(reg);
      }
    });
  }
}


