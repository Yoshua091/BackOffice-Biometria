import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Lista, Lote } from 'src/app/core/entities/lote';
import { environment } from 'src/environments/environment';
import { DetalleArchivoComponent } from '../modales/detalle-archivo/detalle-archivo.component';

@Component({
  selector: 'app-listado-lotes-marcaciones',
  templateUrl: './listado-lotes-marcaciones.component.html',
  styleUrls: ['./listado-lotes-marcaciones.component.scss']
})
export class ListadoLotesMarcacionesComponent implements OnInit {

  lotes: Lista[] = [];
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };
  mostrarMensaje: boolean;

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, private modal: NgbModal) { 
    this.mostrarMensaje = false;
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const { data } = await this.api.marcaciones.marcacionesBuscarLotes(this.paginador.pagina - 1, this.paginador.cantidadPagina);
      this.lotes = data.lista;
      if (this.lotes !== undefined) {
        this.mostrarMensaje = false;
      } else {
        this.mostrarMensaje = true;
      }
      this.paginador.cantidad = data.total;
    } catch (e) {
      if (environment.production) {
        console.log(e);
      }
    }
  }

  async onSubirArchivos({ MarcacionLotesRegistrar }: any): Promise<void> {
    if (!!MarcacionLotesRegistrar) {
      const formData = new FormData();
      formData.append('MarcacionLotesRegistrar', MarcacionLotesRegistrar);

      try {
        await this.api.marcaciones.registrarLoteMarcacion(formData);
        await this.cargarTodos();

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  detalle(lote: Lote): void {
    this.api.marcaciones.buscarLotePorId(lote._id).then(response => {
      if (response.status === 200) {
        const { componentInstance } = this.modal.open(DetalleArchivoComponent, { centered: true, size: 'lg' });
        componentInstance.lote = response.data;
      }
    });
  }
}
