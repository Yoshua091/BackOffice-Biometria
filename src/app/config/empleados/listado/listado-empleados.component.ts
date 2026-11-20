import {Component, OnInit, PipeTransform} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DecimalPipe} from '@angular/common';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {AlertComponent, AlertButtons} from '../../../shared/alert/alert.component';
import {ApiService} from '../../../core/data/api.service';
import {Empleado} from '../../../core/entities/empleado';
import {EmpleadosService} from '../empleados.service';


@Component({
  selector: 'app-listado-empleados',
  templateUrl: './listado-empleados.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./listado-empleados.component.scss']
})
export class ListadoEmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];
  empleados$: Observable<Empleado[]>;
  filter = new FormControl('');
  aviso: boolean = true;

  constructor(
    private empleadosService: EmpleadosService,
    private api: ApiService,
    private router: Router,
    private modal: NgbModal,
    private pipe: DecimalPipe
  ) {

  }

  async ngOnInit(): Promise<void> {
    await this.cargarTodos();
  }

  async registrar(): Promise<void> {
    this.empleadosService.current = {} as Empleado;
    await this.router.navigate(['/config', 'control-empleados', 'formulario'], {queryParams: {mode: 'crear'}});
  }


  async modificar(element: Empleado): Promise<void> {
    this.empleadosService.current = element;
    await this.router.navigate(['/config', 'control-empleados', 'formulario'], {queryParams: {mode: 'editar'}});
  }

  async cargarTodos(): Promise<void> {
    try {
      const {data} = await this.api.usuarios.buscar();
      this.empleados = data.sort((a,b) => a.sucursal?.nombre?.localeCompare(b.sucursal?.nombre));
      this.empleados$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
      this.empleados$.subscribe(employes => {
        if(!employes.length){
          this.aviso = true;
        }else{
          this.aviso = false;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }


  async borrar({_id, _rev, nombre}: Empleado): Promise<void> {
    const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
    result.componentInstance.title = 'Borrar empleado';
    result.componentInstance.description = `Estás seguro que deseas borrar el nombre ${nombre}`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        await this.api.usuarios.borrar({_id, _rev} as Empleado);
        await this.cargarTodos();
      } catch (e) {
        console.log(e);
      }
    }
  }

  // buscador
  search(text: string, pipe: PipeTransform): any[] {
    return this.empleados.filter(empleado => {
      const term = text.toLowerCase();
      
      if (empleado) {
        //filtro por nombre
        const r1 = this.hasTheElement(this.formatFuntion(empleado.nombre), term);
        //filtro por apellido
        const r2 = this.hasTheElement(this.formatFuntion(empleado.apellido), term);
        //filtro por usuario
        const r3 = empleado.usuario ? empleado.usuario.toLowerCase().includes(term) : false;
        //filtro por cedula
        const r4 = empleado.cedula.toString().includes(term);
        //filtro por rol
        const r5 = empleado.rol?.rol ? empleado.rol.rol.toLowerCase().includes(term) : false;
        //filtro por sucursal
        const r6 = empleado.sucursal?.nombre ? this.formatFuntion(empleado.sucursal.nombre).includes(term) : false;
        //filtro por perfil
        const r7 = empleado.perfil?.perfil ? this.formatFuntion(empleado.perfil.perfil).includes(term) : false;
        return r1 || r2 || r3 || r4 || r5 || r6 || r7;
      } else {
        return false;
      }
    });
  }

  private formatFuntion(term: string): string{
    return term.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  }

  private hasTheElement(input: string, term: string):boolean{
    const array = term.split(' '); 
    return array.some(element => {
      if (input.toLowerCase().includes(element.toLowerCase())) {
        return true;
      }
    
      return false;
    });
  }

}

