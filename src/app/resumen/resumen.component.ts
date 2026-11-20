import {Component, OnInit} from '@angular/core';
import {ApiService} from '../core/data/api.service';
import {Solicitudes} from '../core/entities/solicitudes';
import {FormControl, FormGroup} from '@angular/forms';
import * as moment from 'moment';
import {environment} from '../../environments/environment';
import {EstadoSolicitud} from '../core/pipes/estado-solicitud.pipe';

declare const simulador;

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  solicitudes: { [k: string]: Solicitudes[] };
  form: FechasFilterForm;

  constructor(private api: ApiService) {
    this.form = new FechasFilterForm();
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.cargarSolicitudes();
    } catch (e) {
      if (!environment.production) {
        console.log(e);
      }
    }
  }

  async cargarSolicitudes(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      try {
        const {data} = await this.api.solicitudes.pendientesFecha(this.form.getRawValue());
        this.solicitudes = data.reduce((map, obj) => {
          const fecha = moment(obj.createdAt).utc(false).format('DD-MM-YYYY');
          const keys = Object.keys(map);
          const grupo = keys.find(k => k === fecha);

          grupo ? map[grupo].push(obj) : map[fecha] = [obj];

          return map;
        }, {} as { [k: string]: Solicitudes[] });

      } catch (e) {
        if (!environment.production) {
          console.log(e);
        }
      }
    }
  }

  get keys(): string[] {
    return Object.keys(this.solicitudes || {});
  }

  sincronizando(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.Sincronizada);
  }

  validacion(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.ValidacionAsistente);
  }

  aprobacion(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.ValidacionGerente);
  }

  comite(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.Comite);
  }

  otp(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.ValidacionIdentidad);
  }

  desembolsadas(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.AprobadaDesembolsada);
  }

  devueltas(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.Devuelta);
  }

  rechazadas(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.Rechazada);
  }

  desembolsosFallidos(k: string): Solicitudes[] {
    return this.solicitudes[k].filter(s => s.estado === EstadoSolicitud.DesembolsoFallido);
  }

  montoTotal(solicitudes: Solicitudes[]): number {
    return solicitudes.reduce((sum, s) => sum + simulador.sumCuotas(s), 0);
  }
}

class FechasFilterForm extends FormGroup {
  constructor() {
    super({
      fechaInicio: new FormControl(moment()
        .subtract(3, 'days')
        .format('DD-MM-YYYY')),
      fechaFin: new FormControl(moment()
        .format('DD-MM-YYYY')),
    });
  }

  getRawValue(): any {
    const raw = super.getRawValue();

    return {
      fechaInicio: moment(raw.fechaInicio, 'DD-MM-YYYY')
        .utc(false)
        .toISOString(),
      fechaFin: moment(raw.fechaFin, 'DD-MM-YYYY')
        .utc(false)
        .toISOString(),
    };
  }
}
