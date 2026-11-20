import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { LotesDispersion, Registros, RegistrosIdentificacion } from 'src/app/core/entities/lotes-dispersion';

@Component({
  selector: 'app-detalle-lotes-dispersiones',
  templateUrl: './detalle-lotes-dispersiones.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./detalle-lotes-dispersiones.component.scss']
})
export class DetalleLotesDispersionesComponent implements OnInit {

  @Input() element: any;
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };
  lotesDispersion: any;
  detalleLotes: any[] = [];
  clienteNoRegistrado: string;
  estadoDispersion = EstadoDispersionString;
  filter = new FormControl('');
  detalleDispersiones$: Observable<any[]>;
  aviso: boolean = true;

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  mostrarDatos: any[];
  constructor(private api: ApiService, public modal: NgbActiveModal, private pipe: DecimalPipe) {
    this.clienteNoRegistrado = '';
  }

  ngOnInit(): void {
    this.getDetalle();
  }

  async getDetalle() {
    try {
      this.lotesDispersion = (await this.api.dispersiones.getBuscarId(this.element)).data;

      // Inicializa el observable de detalleDispersiones$
      this.detalleDispersiones$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.paginate(this.search(text, this.pipe)))
      );

      // Actualiza el valor del aviso
      this.detalleDispersiones$.subscribe(detalle => {
        this.aviso = detalle.length === 0;
      });

      this.paginador.cantidad = this.lotesDispersion.registros.length;
    } catch (e) {
      console.log(e);
    }
  }
  crearObjeto(element, elementMiembroDos) {
    this.mostrarDatos.push({
      nombres: element.nombres + element.apellidos
    });
  }

  getColorByEstado(estado: number): string {
    switch (estado) {
      case 1:
      case 2:
        return 'green';
      case 3:
      case 4:
      case 5:
      case 6:
        return 'red';
      default:
        return 'black';
    }
  }

  search(text: string, pipe: PipeTransform): any[] {
    const term = text.toLowerCase();
    // Filtra el conjunto completo de datos
    return this.lotesDispersion.registros.filter(detalle => {
      if (detalle) {
        return String(detalle.numeroIdentificacion).toLowerCase().includes(term);
      }
      return false;
    });
  }

  paginate(filteredData: any[]): any[] {
    // Aplica la paginación al resultado filtrado
    const startIndex = (this.paginador.pagina - 1) * this.paginador.cantidadPagina;
    const endIndex = startIndex + this.paginador.cantidadPagina;
    return filteredData.slice(startIndex, endIndex);
  }
}
export const EstadoDispersionString = {
  0: 'Dispersión en estado inicial.',
  1: 'Dispersión realizada.',
  2: 'Dispersión en proceso.',
  3: 'Dispersión con errores.',
  4: 'Dispersión a resetear.',
  5: 'Dispersión anulada.',
  6: 'Dispersión por validar.',
  99: 'Dispersión a ignorar.'
};