import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/core/data/api.service';
import { Empleado } from 'src/app/core/entities/empleado';
import { Sucursal } from 'src/app/core/entities/sucursal';
import { Zona } from 'src/app/core/entities/zona';
import { AlertButtons, AlertComponent } from 'src/app/shared/alert/alert.component';
import { SucursalesService } from '../../sucursales.service';
import { ZonasService } from '../zonas.service';

@Component({
  selector: 'app-listado-zonas',
  templateUrl: './listado-zonas.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./listado-zonas.component.scss']
})
export class ListadoZonasComponent implements OnInit {
  sucursales: any;
  nombreSucursal: string;
  zonas: Zona[];
  asesores: Empleado[];
  zonas$: Observable<Zona[]>;
  filter = new FormControl('');
  aviso: boolean = true;

  constructor(
    private zonasService: ZonasService,
    private api: ApiService,
    private router: Router,
    private modal: NgbModal,
    private route: ActivatedRoute,
    private pipe: DecimalPipe
  ) {
    this.sucursales = this.route.snapshot.queryParams;
    this.nombreSucursal = this.sucursales.nombre;
  }

  ngOnInit(): void {
    this.listar();
    this.listarAsesores();
  }

  empleado (zona: Zona): Empleado {
    return this. asesores?.find(asesor => asesor?._id == zona?.usuario_id);
  }

  async registrar(): Promise<void> {
    const {_id, nombre} = this.sucursales;
    this.zonasService.current = {} as Zona;
    await this.router.navigate(['/config', 'sucursales', 'formulario-zonas'], { queryParams: { mode: 'crear', _id, nombre } });
  }

  async modificar(element: Zona): Promise<void> {
    const {_id, nombre} = this.sucursales;
    this.zonasService.current = element;
    await this.router.navigate(['/config', 'sucursales', 'formulario-zonas'], { queryParams: { mode: 'editar', _id, nombre } });
  }

  async borrar({_id, sucursal_id, nombre}: Zona): Promise<void> {
    const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
    result.componentInstance.title = 'Borrar zona';
    result.componentInstance.description = `Estás seguro que deseas borrar la zona ${nombre}`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        await this.api.zonas.borrar({_id, sucursal_id});
        await this.listar();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async quitarAsesor({_id, sucursal_id, nombre}: Zona): Promise<void> {
    const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
    result.componentInstance.title = 'Borrar asesor de la zona';
    result.componentInstance.description = `Estás seguro que deseas borrar el asesor de la zona ${nombre}`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        await this.api.zonas.borrarUsuarioZona({_id, sucursal_id});
        await this.listar();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async listar(): Promise<void> {
    const { _id } = this.sucursales;
    try {
      const { data } = await this.api.zonas.buscar({ sucursal_id: _id });
      this.zonas = data.sort((a,b) => a.nombre.localeCompare(b.nombre));
      this.zonas$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
      this.zonas$.subscribe(zona => {
        if(!zona.length){
          this.aviso = true;
        }else{
          this.aviso = false;
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  async listarAsesores(): Promise<void> {
    const { _id } = this.sucursales;
    try {
      const { data } = await this.api.usuarios.buscarPorSucursal({ _id });
      this.asesores = data;
    } catch (e) {
      console.log(e);
    }
  }

    // buscador
    search(text: string, pipe: PipeTransform): any[] {
      return this.zonas.filter(zona => {
        const term = text.toLowerCase();
        
        if (zona) {
          
          //filtro por nombre
          const r1 = this.hasTheElement(this.formatFuntion(zona.nombre), term);
          return r1
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
