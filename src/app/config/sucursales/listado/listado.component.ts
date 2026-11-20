import {Component, OnInit, PipeTransform} from '@angular/core';
import {Sucursal} from '../../../core/entities/sucursal';
import {ApiService} from '../../../core/data/api.service';
import {Router} from '@angular/router';
import {AlertButtons, AlertComponent} from '../../../shared/alert/alert.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpErrorResponse} from '@angular/common/http';
import {Empleado} from '../../../core/entities/empleado';
import {SucursalesService} from '../sucursales.service';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./listado.component.scss']
})
export class ListadoComponent implements OnInit {

  sucursales: Sucursal[] = [];
  sucursales$: Observable<Sucursal[]>;
  filter = new FormControl('');
  aviso: boolean = true;

  constructor(
    private sucursalesService: SucursalesService,
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
    this.sucursalesService.current = {} as Sucursal;
    await this.router.navigate(['/config', 'sucursales', 'formulario'], {queryParams: {mode: 'crear'}});
  }

  async modificar(element: Sucursal): Promise<void> {
    this.sucursalesService.current = element;
    await this.router.navigate(['/config', 'sucursales', 'formulario'], {queryParams: {mode: 'editar'}});
  }

  async zonas({_id, nombre}: Sucursal): Promise<void> {
    await this.router.navigate(['/config', 'sucursales', 'listado-zonas'], {queryParams: {_id, nombre}});
  }


  async borrar({_id, _rev, nombre}: Sucursal): Promise<void> {
    const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
    result.componentInstance.title = 'Borrar sucursal';
    result.componentInstance.description = `Estás seguro que deseas borrar la sucursal ${nombre}`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        await this.api.sucursales.borrar({_id, _rev});
        await this.cargarTodos();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async cargarTodos(): Promise<void> {
    try {
      const {data} = await this.api.sucursales.buscar();
      this.sucursales = data.sort((a, b) => Number(a.idSucursal) - Number(b.idSucursal));
      this.sucursales$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
      this.sucursales$.subscribe(sucursal => {
        if(!sucursal.length){
          this.aviso = true;
        }else{
          this.aviso = false;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

    // buscador
    search(text: string, pipe: PipeTransform): any[] {
      return this.sucursales.filter(sucursal => {
        const term = text.toLowerCase();
        
        if (sucursal) {
          //filtro por nombre
          const r1 = sucursal.nombre ? this.formatFuntion(sucursal.nombre).includes(term) : false;
           //filtro por id sucursal
          const r2 = String(sucursal.idSucursal).includes(term);
          return r1 || r2;
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
