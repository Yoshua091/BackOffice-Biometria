import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { DetalleHistorico, Historico, Registro } from 'src/app/core/entities/bancolombia.interface';

@Component({
  selector: 'app-detalle-archivo-historico',
  templateUrl: './detalle-archivo-historico.component.html',
  styleUrls: ['./detalle-archivo-historico.component.scss']
})
export class DetalleArchivoHistoricoComponent implements OnInit {
  @Input() element: Historico;
  detalle: DetalleHistorico;
  procesados: Registro[] = [];
  errores: Registro[] = [];
  constructor(private api: ApiService, public modal: NgbActiveModal) { }

  ngOnInit(): void {
    this.getDetalle();
  }

  async getDetalle() {
    this.detalle = (await this.api.bancolombiaDispersiones.getDetallleHistorico(this.element._id)).data;
    this.filtrarRegistros();
  }

  filtrarRegistros() {
    this.detalle.registros.forEach(reg => {
      if (reg.estado.id === 1) {
        this.procesados.push(reg);
      } else {
        this.errores.push(reg);
      }
    });
  }

}
