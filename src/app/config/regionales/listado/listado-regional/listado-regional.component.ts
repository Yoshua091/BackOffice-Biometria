import { AlertComponent, AlertButtons } from 'src/app/shared/alert/alert.component';
import { DecimalPipe } from '@angular/common';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';
import { SucursalesService } from 'src/app/core/data/sucursales-data.servie';
import { RegionalesService } from '../../regionales.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-listado-regional',
  templateUrl: './listado-regional.component.html',
  providers: [DecimalPipe],
  styleUrls: ['./listado-regional.component.scss']
})
export class ListadoRegionalComponent implements OnInit {

  regioanales: any[] = [];
  regionales$: Observable<any[]>;
  filter = new FormControl('');
  aviso: boolean = true;

  constructor(
    private regionalesService: RegionalesService,
    private api: ApiService,
    private router: Router,
    private modal: NgbModal,
    private pipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.listarRegionales()
  }

  async registrar(): Promise<void> {
    this.regionalesService.current = {} as any;
    await this.router.navigate(['/config', 'regionales', 'formulario'], {queryParams: {mode: 'crear'}});
  }

  async modificar(element: any): Promise<void> {
    this.regionalesService.current = element;
    await this.router.navigate(['/config', 'regionales', 'formulario'], {queryParams: {mode: 'editar'}});
  }
  
  async borrar(regional: any): Promise<void> {
    const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
    result.componentInstance.title = 'Borrar regional';
    result.componentInstance.description = `Estás seguro que deseas borrar la regional ${regional.nombre}`;
    result.componentInstance.buttons = AlertButtons.CONFIRM;

    const confirmar = await result.result;

    if (confirmar) {
      try {
        await this.api.regionales.actualizarRegional({...regional, estado:0});
        await this.listarRegionales();
      } catch (e) {
        console.log(e);
      }
    }
  }

  async listarRegionales() {
    try {
      const {data} = await this.api.regionales.consultarRegionales();
      this.regioanales = data.sort((a,b) => a.nombre?.localeCompare(b.nombre));
      this.regionales$ = this.filter.valueChanges.pipe(
        startWith(''),
        map(text => this.search(text, this.pipe))
      );
      this.regionales$.subscribe(regional => {
        if(!regional.length){
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
      return this.regioanales.filter(regional => {
        const term = text.toLowerCase();
        
        if (regional) {
          //filtro por nombre
          const r1 = regional.nombre ? this.formatFuntion(regional.nombre).includes(term) : false;
           //filtro por id sucursal
          const r2 = String(regional.idRegion).includes(term);
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
