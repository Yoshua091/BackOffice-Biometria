import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { Historico } from 'src/app/core/entities/bancolombia.interface';
import { environment } from 'src/environments/environment';
import { DetalleArchivoHistoricoComponent } from '../modales/detalle-archivo-historico/detalle-archivo-historico.component';

@Component({
  selector: 'app-listado-historico',
  templateUrl: './listado-historico.component.html',
  styleUrls: ['./listado-historico.component.scss']
})
export class ListadoHistoricoComponent implements OnInit {
  historicos: Historico[] = [];
  constructor(private api: ApiService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.listarHistoricos();
  }

  async onSubirArchivos({ historicosRegistrar }: any): Promise<void> {
    if (!!historicosRegistrar) {
      const formData = new FormData();
      formData.append('reportehistorico', historicosRegistrar);

      try {
        await this.api.bancolombiaDispersiones.registrarHistoricos(formData);
        await this.listarHistoricos();
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  async listarHistoricos() {
    try {
      const response = await this.api.bancolombiaDispersiones.getListaHistoricos();
      if (response.status === 200) {
        this.historicos = response.data;
      }
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

  getPorcentajeAvance(disp: Historico) {
    return Math.round((disp.avance * 100) / disp.total);
  }

  detalle(element: Historico): void {
    const { componentInstance } = this.modal.open(DetalleArchivoHistoricoComponent, { centered: true, size: 'lg' });
    componentInstance.element = element;
  }

}
