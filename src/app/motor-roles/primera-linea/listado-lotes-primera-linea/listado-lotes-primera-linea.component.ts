import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { environment } from 'src/environments/environment';
import { ModalesComponent } from '../../modales/modales.component';
import { SessionService } from 'src/app/core/session.service';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-listado-lotes-primera-linea',
  templateUrl: './listado-lotes-primera-linea.component.html',
  styleUrls: ['./listado-lotes-primera-linea.component.scss']
})
export class ListadoLotesPrimeraLineaComponent implements OnInit {
  lotes: any;
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };
  mostrarMensaje: boolean;
  estadoMotor = EstadoReglasMotorString
  titulo: string = '';
  estadoLote: number;
  estados: EstadoTransferenciaMap = new EstadoTransferenciaMap();
  estado: string;

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }

  constructor(private api: ApiService, private modal: NgbModal, private session: SessionService) {
    this.session.user.rol.id === 11 ? this.titulo = 'Primera' : this.titulo = 'Segunda';
    this.session.user.rol.id === 11 ? this.estadoLote = EstadoReglasMotorString.LoteEnPruebas : this.estadoLote = EstadoReglasMotorString.LoteProductivo;

  }

  async ngOnInit(): Promise<void> {
    // await this.cargarTodos();
  }

  async activeIdChange(): Promise<void> {
    const estado = Number(this.estado);
    await this.cargarTodos(estado);
  }

  async cargarTodos(estado: number): Promise<void> {
    try {
      const response = await this.api.motor.motorReglasBuscarLotes(estado); // Llama al servicio que trae el lote
      this.lotes = response.data; // Accede a `data` directamente
      if (!this.lotes || Object.keys(this.lotes).length === 0) {
        this.mostrarMensaje = true; // Mostrar mensaje si no hay lotes
      } else {
        this.mostrarMensaje = false;
      }
    } catch (e) {
      if (e.status === 404) {
        // Si recibes un error 404 (no encontrado), muestra el mensaje
        this.mostrarMensaje = true;
        console.log("Error 404: Recurso no encontrado");
      } else {
        console.error("Error inesperado", e);
        this.mostrarMensaje = true;
      }
    }
  }

  async onSubirArchivos({ ReglasMotor }: any): Promise<void> {
    if (!!ReglasMotor) {
      const formData = new FormData();
      formData.append('ReglasMotor', ReglasMotor);

      try {
        await this.api.motor.registrarLoteReglasMotor(formData);
        await this.activeIdChange();

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  simular(loteEstado): void {
    const { componentInstance } = this.modal.open(ModalesComponent, { centered: true, size: 'lg' });
    componentInstance.loteEstado = loteEstado;
  }

  async aprobar(): Promise<void> {
    const result = this.modal.open(AlertComponent, { centered: true, size: 'm' });
    result.componentInstance.title = 'Aprobar reglas';
    result.componentInstance.description = `Estás seguro de que deseas aprobar el lote de reglas, el lote anterior dejara de funcionar inmediatamente.`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;    

    if (confirmar) {
      try {
        const element = {
          aprobar: true
        }
        await this.api.motor.aprobarLoteReglasMotor(element);
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.activeIdChange();
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.log(e);
      }
    }
  }

  async rechazar(): Promise<void> {
    const result = this.modal.open(AlertComponent, { centered: true, size: 'm' });
    result.componentInstance.title = 'Rechazar reglas';
    result.componentInstance.description = `Estás seguro de que deseas rechazar el lote de reglas.`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;    

    if (confirmar) {
      try {
        const element = {
          aprobar: false
        }
        await this.api.motor.aprobarLoteReglasMotor(element);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.activeIdChange();
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.log(e);
      }
    }
  }
}

export enum EstadoReglasMotorString {
  LotePruebasInhabilitado = 0,
  LoteEnPruebas = 1,
  LoteProductivo = 2,
  LoteProductivoInhabilitado = 3,
  LoteEnPruebasRechazado = 99
};


class EstadoTransferenciaMap {
  LotePruebasInhabilitado = [EstadoReglasMotorString.LotePruebasInhabilitado].join('-');
  LoteEnPruebas = [EstadoReglasMotorString.LoteEnPruebas].join('-');
  LoteProductivo = [EstadoReglasMotorString.LoteProductivo].join('-');
  LoteProductivoInhabilitado = [EstadoReglasMotorString.LoteProductivoInhabilitado].join('-');
  LoteEnPruebasRechazado = [EstadoReglasMotorString.LoteEnPruebasRechazado].join('-');

}
