import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { STORAGE_KEYS } from '../core/constants';
import { ApiService } from '../core/data/api.service';
import { Sucursal } from '../core/entities/sucursal';
import { SessionService } from '../core/session.service';
import { Roles } from '../core/types';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {
  form: ListadoPropuestasFiltroForm;
  sucursales: Sucursal[];
  anios: any[];
  meses: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  estado: string;
  lat: number;
  lon: number;
  markers: any[];
  markersAll: any[];
  zonasUnicas: any[];

  constructor(
    private api: ApiService,
    private router: Router,
    private session: SessionService,
    private route: ActivatedRoute,
    private modal: NgbModal
  ) {
    const { queryParams } = this.route.snapshot;
    const sucursales = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUCURSALES)) || [];
    this.anios = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG)).anos || [];

    this.sucursales = [Roles.ADMIN, Roles.COMITE].includes(this.session.user.rol.id) ?
      [{ _id: 'TODOS', nombre: 'TODOS' } as Sucursal, ...sucursales] : sucursales;

    const filtroListadoInicial = { ...queryParams, _idSucursal: this.sucursales[0]._id };

    this.form = new ListadoPropuestasFiltroForm(filtroListadoInicial as FiltroListadoSolicitudFormStruct);
    this.lat = 4.60971;
    this.lon = -74.08175;
  }

  ngOnInit(): void {}

  async filtrar() {
    if (this.form.valid) {
      try {
        const { _idSucursal, ano, mes } = this.form.getRawValue();
        const { data } = await this.api.solicitudes.obtenerPosiciones({ _idSucursal, ano, mes });
        this.markers = data;
        this.markersAll = this.markers.map(item => ({
          ...item,
        }));

        this.zonasUnicas = this.obtenerZonasUnicas(data);
        this.lat = this.zonasUnicas[0].location?.lat;
        this.lon = this.zonasUnicas[0].location?.lon;
      } catch (e) {
        console.error(e);
      }
    }
  }

  getSvg(color: string): string {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 48 48" fill="${color}">
      <path d="M16 0c-8.836 0-16 7.164-16 16s16 32 16 32 16-23.164 16-32c0-8.836-7.164-16-16-16zM16 24c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

getMarkerOptions(marker: any): google.maps.MarkerOptions {
  return {
    position: {
      lat: marker.location.lat,
      lng: marker.location.lon
    },
    icon: {
      url: this.getSvg(marker.color),
      scaledSize: new google.maps.Size(48, 48), // Tamaño del icono
      anchor: new google.maps.Point(24, 48) // Ajusta el punto de anclaje
    }
  };
}

  obtenerZonasUnicas(data) {
    const zonasUnicas = new Set();
    const unicas = data.filter(obj => {
      if (zonasUnicas.has(obj.zona)) {
        return false;
      } else {
        const partesLabel = obj.label.split('--');
        obj.label = partesLabel[0].trim();
        zonasUnicas.add(obj.zona);
        return true;
      }
    });
    return unicas;
  }
}

class FiltroListadoSolicitudFormStruct {
  _idSucursal: string;
  ano: string;
  mes: string;
}

class ListadoPropuestasFiltroForm extends FormGroup {
  constructor(filtro: FiltroListadoSolicitudFormStruct) {
    super({
      _idSucursal: new FormControl(filtro._idSucursal || 'TODOS'),
      ano: new FormControl(filtro.ano || moment().format('YYYY')),
      mes: new FormControl(filtro.mes || moment().format('MM')),
    });
  }
}
