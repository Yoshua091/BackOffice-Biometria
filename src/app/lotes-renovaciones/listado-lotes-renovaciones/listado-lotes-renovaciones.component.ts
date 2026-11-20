import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEYS } from 'src/app/core/constants';

import { ApiService } from 'src/app/core/data/api.service';
import { Lista, Lote } from 'src/app/core/entities/renovaciones';
import { environment } from 'src/environments/environment';
import { LoteRenovacion } from '../../core/entities/lote-renovacion';
import { DetalleArchivoLotesRenovacionesComponent } from '../modales';

@Component({
  selector: 'app-listado-lotes-renovaciones',
  templateUrl: './listado-lotes-renovaciones.component.html',
  styleUrls: ['./listado-lotes-renovaciones.component.scss']
})
export class ListadoLotesRenovacionesComponent implements OnInit {

  lotes: Lista[] = [];
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, private modal: NgbModal) { }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const { data } = await this.api.renovaciones.buscarLotes(this.paginador.pagina - 1, this.paginador.cantidadPagina);
      this.lotes = data.lista;
      this.paginador.cantidad = data.total;
    } catch (e) {
      if (environment.production) {
        console.log(e);
      }
    }
  }
  getPaginas(): number[] {
  const totalPaginas = Math.ceil(this.paginador.cantidad / this.paginador.cantidadPagina);
  const paginas: number[] = [];

  const maxPaginasMostrar = 10;

  let inicio = Math.max(1, this.paginador.pagina - Math.floor(maxPaginasMostrar / 2));
  let fin = Math.min(totalPaginas, inicio + maxPaginasMostrar - 1);

  for (let i = inicio; i <= fin; i++) {
    paginas.push(i);
  }

  return paginas;
}

async cambiarPagina(pagina: number): Promise<void> {
  this.paginador.pagina = pagina;
  await this.cargarTodos();
}

  async onSubirArchivos({ RenovacionLotesRegistrar }: any): Promise<void> {
    if (!!RenovacionLotesRegistrar) {
      const formData = new FormData();
      formData.append('RenovacionLotesRegistrar', RenovacionLotesRegistrar);

      try {
        await this.api.renovaciones.registrarLoteRenovacion(formData);
        await this.cargarTodos();

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  detalle(lote: Lote): void {
    this.api.renovaciones.buscarLotePorId(lote._id).then(response => {
      if (response.status === 200) {
        const { componentInstance } = this.modal.open(DetalleArchivoLotesRenovacionesComponent, { centered: true, size: 'lg' });
        componentInstance.lote = response.data;
      }
    });
  }
}
