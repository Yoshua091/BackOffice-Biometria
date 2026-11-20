import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente, Foto, Solicitudes } from 'src/app/core/entities/solicitudes';

@Component({
  selector: 'app-distancia-fotos-modal',
  templateUrl: './distancia-fotos-modal.component.html',
  styleUrls: ['./distancia-fotos-modal.component.scss']
})
export class DistanciaFotosModalComponent implements OnInit {

  @Input() solicitud: Solicitudes;

  form: DistanciaFotosForm;

  miembro: Cliente[];
  fotos: Foto[];
  fotosPosicion: any;
  mostrarDatos: any[];
  miembroUnoFotos: any[];
  miembroDosFotos: any[];
  mostarTabla: boolean;
  noHayDatos: boolean;
  

  constructor(public modal: NgbActiveModal) {
    this.form = new DistanciaFotosForm({} as DistanciaFotosFormStruct);
    this.mostarTabla = false;
    this.noHayDatos = false;
  }

  ngOnInit(): void {
  }

  listarPosicion() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.mostrarDatos = [];
      this.miembro = this.solicitud.miembros;
      this.fotosPosicion = this.solicitud.fotos;
      this.obtenerDatosMiebroUno();
      this.obtenerDatosMiebroDos();
      this.mostrarDistancia();
    }
  }

  

  obtenerDatosMiebroUno() {
    this.miembro.forEach((element, index) => {
      if (this.form.controls.miembroUno.value === index)
        this.miembroUnoFotos = element.fotos;
    });
    if (this.form.controls.miembroUno.value !== '' && this.form.controls.miembroDos.value !== '') {
      for (const [keyFoto, idFoto] of Object.entries(this.miembroUnoFotos)) {
        if (this.fotosPosicion.length !== 0) {
          for (var elementMiembroUno of this.fotosPosicion) {
            if (elementMiembroUno.Nombreid === idFoto && elementMiembroUno.keyNombre === keyFoto) {
              this.crearObjeto(elementMiembroUno, '');
            }
          }
        } else {
          this.noHayDatos = true;
        }
      }
    }
  }

  obtenerDatosMiebroDos() {
    this.miembro.forEach((element, index) => {
      if (this.form.controls.miembroDos.value === index)
        this.miembroDosFotos = element.fotos;
    });
    let i = 0;
    if (this.form.controls.miembroDos.value !== '') {
      for (const [keyFoto, idFoto] of Object.entries(this.miembroDosFotos)) {
        if (this.fotosPosicion.length !== 0) {
          for (var elementMiembroDos of this.fotosPosicion) {
            if (elementMiembroDos.Nombreid === idFoto && elementMiembroDos.keyNombre === keyFoto) {
              this.crearObjetoDos(elementMiembroDos, i++);
            }
          }
        } else {
          this.noHayDatos = true;
        }
      }
    }
  }

  crearObjeto(elementMiembroUno, elementMiembroDos) {
    this.mostrarDatos.push({
      longitudMiembroUno: elementMiembroUno.latitud,
      latitudMiembroUno: elementMiembroUno.logintud,
      longitudMiembroDos: elementMiembroDos.latitud,
      latitudMiembroDos: elementMiembroDos.logintud,
      keyFoto: elementMiembroUno.keyNombre,
      distanciaFotos: ''
    });
    this.mostarTabla = true;
  }

  crearObjetoDos(elementMiembroDos, posicion) {
    this.mostrarDatos[posicion].longitudMiembroDos = elementMiembroDos.latitud;
    this.mostrarDatos[posicion].latitudMiembroDos = elementMiembroDos.logintud;
  }

  crearObjetoDistancia(distanciaEnKilometros, posicion) {
    this.mostrarDatos[posicion].distanciaFotos = String(distanciaEnKilometros) !== 'NaN' ? distanciaEnKilometros + 'm' : undefined
  }

  gradosARadianes(grados) {
    return grados * Math.PI / 180;
  };

  calcularDistanciaEntreDosCoordenadas(lat1, lon1, lat2, lon2) {
    // Convertir todas las coordenadas a radianes
    lat1 = this.gradosARadianes(lat1);
    lon1 = this.gradosARadianes(lon1);
    lat2 = this.gradosARadianes(lat2);
    lon2 = this.gradosARadianes(lon2);
    // Aplicar fórmula
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    let diferenciaEntreLongitudes = (lon2 - lon1);
    let diferenciaEntreLatitudes = (lat2 - lat1);
    let a = Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((RADIO_TIERRA_EN_KILOMETROS * c) * 1000);
  };

  mostrarDistancia() {
    let i = 0;
    for (var element of this.mostrarDatos) {
      this.calcularDistanciaEntreDosCoordenadas(element.latitudMiembroUno, element.longitudMiembroUno, element.latitudMiembroDos, element.longitudMiembroDos)
      const distanciaEnKilometros = this.calcularDistanciaEntreDosCoordenadas(element.latitudMiembroUno, element.longitudMiembroUno, element.latitudMiembroDos, element.longitudMiembroDos);
      this.crearObjetoDistancia(distanciaEnKilometros, i++)
    }
  }
}


class DistanciaFotosFormStruct {
  miembroUno: string;
  miembroDos: string;
}

class DistanciaFotosForm extends FormGroup {

  constructor(distanciaFotos: DistanciaFotosFormStruct) {

    super({
      miembroUno: new FormControl(distanciaFotos.miembroUno),
      miembroDos: new FormControl(distanciaFotos.miembroDos),
    });

    this.controls.miembroUno.setValidators([
      Validators.required,
    ]);

    this.controls.miembroDos.setValidators([
      Validators.required,
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

