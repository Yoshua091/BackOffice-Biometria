import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/data/api.service';
import { Lista } from 'src/app/core/entities/lote';
import { environment } from '../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetalleArchivoModalComponent } from '../modales/detalle-archivo-modal/detalle-archivo-modal.component';
import { STORAGE_KEYS } from 'src/app/core/constants';

@Component({
  selector: 'app-listado-lotes',
  templateUrl: './listado-lotes.component.html',
  styleUrls: ['./listado-lotes.component.scss']
})
export class ListadoLotesComponent implements OnInit {

  lotes: Lista[] = [];
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, private modal: NgbModal) {
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const { data } = await this.api.cobranzas.buscarLotes(this.paginador.pagina - 1, this.paginador.cantidadPagina);
      this.lotes = data.lista;
      this.paginador.cantidad = data.total;
    } catch (e) {
      if (environment.production) {
        console.log(e);
      }
    }
  }

  async onSubirArchivos({ CarteraLotesRegistrar }: any): Promise<void> {
    if (!!CarteraLotesRegistrar) {
      const formData = new FormData();
      formData.append('CarteraLoresRegistrar', CarteraLotesRegistrar);

      try {
        await this.api.cobranzas.registrarLote(formData);
        await this.cargarTodos();

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  detalle(lote: Lista): void {
    this.api.cobranzas.buscarLotePorId(lote._id).then(response => {
      if (response.status === 200) {
        const { componentInstance } = this.modal.open(DetalleArchivoModalComponent, { centered: true, size: 'lg' });
        componentInstance.lote = response.data;
      }
    })
  }
}
