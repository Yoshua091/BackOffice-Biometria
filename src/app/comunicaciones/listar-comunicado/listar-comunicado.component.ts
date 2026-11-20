import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { STORAGE_KEYS } from 'src/app/core/constants';
import { ApiService } from 'src/app/core/data/api.service';
import { Usuario } from 'src/app/core/entities/lote';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-listar-comunicado',
  templateUrl: './listar-comunicado.component.html',
  styleUrls: ['./listar-comunicado.component.scss']
})
export class ListarComunicadoComponent implements OnInit {

  comunicados: any[];
  paginador = { cantidad: 0, cantidadPagina: this.cantidadPorPagina, pagina: 1 };
  user: Usuario

  get cantidadPorPagina(): number {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;
    const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CONFIG))?.registrosPorPagina;

    return local ? local : session ? session : 0;
  }
  constructor(
    private api: ApiService,
    private modal: NgbModal) {
    this.user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async cargarTodos(): Promise<void> {
    try {
      const estado = 1;
      const { data } = await this.api.comunicaciones.comunicadoBuscar(estado);
      this.comunicados = data;
      this.paginador.cantidad = data.length;
    } catch (e) {
      console.log(e);
    }
  }

  async onSubirArchivos(data): Promise<void> {
    try {
      const dataForm = data;
      let usuarioRegistra = {} as any
      usuarioRegistra.nombre = this.user.nombre;
      usuarioRegistra.Apellido = this.user.apellido;
      usuarioRegistra.usuario_id = this.user.idUsuario;
      dataForm.usuarioRegistra = usuarioRegistra;
      await this.api.comunicaciones.comunicadoRegistrar(dataForm);
      await this.cargarTodos();
    } catch (e) {
      console.log(e);
    }
  }

  async borrar({ _id }: any): Promise<void> {
    const result = this.modal.open(AlertComponent, { centered: true, size: 'sm' });
    result.componentInstance.title = 'Borrar comunicado';
    result.componentInstance.description = `Estás seguro que deseas borrar el comunicado.`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        const estado = 0;
        await this.api.comunicaciones.comunicadoBorrar({ _id, estado });
        await this.cargarTodos();
      } catch (e) {
        console.log(e);
      }
    }
  }

}
