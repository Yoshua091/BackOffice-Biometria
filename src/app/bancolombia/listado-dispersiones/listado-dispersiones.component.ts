import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { Dispersion } from 'src/app/core/entities/bancolombia.interface';
import { environment } from 'src/environments/environment';
import { DetalleArchivoDispersionesComponent } from '../modales/detalle-archivo-dispersiones/detalle-archivo-dispersiones.component';
import { DetalleArchivoHistoricoComponent } from '../modales/detalle-archivo-historico/detalle-archivo-historico.component';

@Component({
  selector: 'app-listado-dispersiones',
  templateUrl: './listado-dispersiones.component.html',
  styleUrls: ['./listado-dispersiones.component.scss']
})
export class ListadoDispersionesComponent implements OnInit {
  dispersiones: Dispersion[] = [];
  constructor(private api: ApiService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.listarDispersiones();
  }

  async onSubirArchivos({ dispersionesRegistrar }: any): Promise<void> {
    if (!!dispersionesRegistrar) {
      const formData = new FormData();
      formData.append('DispersionesLotesRegistrar', dispersionesRegistrar);

      try {
        await this.api.bancolombiaDispersiones.registrarDispersiones(formData);
        await this.listarDispersiones();
      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  async listarDispersiones() {
    try {
      const response = await this.api.bancolombiaDispersiones.getListaDispersiones();
      if (response.status === 200) {
        this.dispersiones = response.data;
      }
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

  getPorcentajeAvance(disp: Dispersion) {
    return Math.round((disp.avance * 100) / disp.registros);
  }

  detalle(element: Dispersion): void {
    const { componentInstance } = this.modal.open(DetalleArchivoDispersionesComponent, { centered: true, size: 'lg' });
    componentInstance.element = element;
  }
}
