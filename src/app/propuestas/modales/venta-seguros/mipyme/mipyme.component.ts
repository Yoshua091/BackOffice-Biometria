import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged } from 'rxjs/operators';
import { Departamentos, Municipios, REGEX } from 'src/app/core/constants';
import { MipymeDataService } from 'src/app/core/data/mipyme-data.service';

@Component({
  selector: 'app-mipyme',
  templateUrl: './mipyme.component.html',
  styleUrls: ['./mipyme.component.scss']
})
export class MipymeComponent implements OnInit {

  MipymeForm: MipymeForm;
  tipoViviendaLista: any[];
  proteccionAlarmaLista: any[];
  proteccionVigilanciaLista: any[];
  tipoConstruccion: any[];
  departamentos: any[];
  municipios: any[];
  municipiosDisponibles: any[] = [];
  municipiosDisponiblesResidencial: any = [];
  datos: any;

  constructor(public modal: NgbActiveModal, public mipymeService: MipymeDataService) {
    this.MipymeForm = new MipymeForm();
    this.tipoViviendaLista = tipoVivienda;
    this.proteccionAlarmaLista = proteccionAlarma;
    this.proteccionVigilanciaLista = proteccionVigilancia;
    this.tipoConstruccion = TipoDeConstruccion
  }

  ngOnInit(): void {
    this.departamentos = Departamentos.data || [];
    this.municipios = Municipios.data || [];
    if (this.datos) {
      this.MipymeForm.patchValue({...this.datos,
        departamento: this.datos.departamento?.divipolad,
        municipio: this.datos.municipio?.divipolam,
        aniosConstruccion: this.datos?.añosConstruccion,
        tipoDeViviendaResid: this.tipoViviendaLista.find(tipo => tipo.id === this.datos.tipoDeViviendaResid?.id),
        proteccionDeAlarma: this.proteccionAlarmaLista.find(tipo => tipo.id === this.datos.proteccionDeAlarma?.id),
        proteccionDeVigilancia: this.proteccionVigilanciaLista.find(tipo => tipo.id === this.datos.proteccionDeVigilancia?.id),
        departamentoResidencial: this.datos.departamentoResidencial?.divipolad,
        municipioResid: this.datos.municipioResid?.divipolam,
        tipoConstruccion: this.tipoConstruccion.find(tipo => tipo.id === this.datos.tipoConstruccion?.id),
      });

      this.actualizarMunicipios(this.datos.departamento?.divipolad, 'comercial');
      this.actualizarMunicipios(this.datos.departamentoResidencial?.divipolad, 'residencial');
    }
  }

  onChangeEsComercial(value: boolean) {
    if (!value) {
      this.MipymeForm.patchValue({
        razonSocial: '',
        actividadMipyme: '',
        documentoIdentidad: '',
        direccion: '',
        objetosDeValor: '',
        aniosConstruccion: '',
        numeroSotanos: '',
        numeroPisos: '',
        departamento: '',
        municipio: ''
      });
    }
  }

  onChangeEsResidencial(value: boolean) {
    if (!value) {
      this.MipymeForm.patchValue({
        direccionResidencial: '',
        tipoDeViviendaResid: '',
        proteccionDeAlarma: '',
        proteccionDeVigilancia: '',
        departamentoResidencial: '',
        municipioResid: ''
      });
    }
  }
  actualizarMunicipios(departamentoSeleccionado: string, tipo: 'comercial' | 'residencial') {
    const municipiosFiltrados = this.municipios.filter(municipio => municipio.divipolad === departamentoSeleccionado);

    if (tipo === 'comercial') {
      this.municipiosDisponibles = municipiosFiltrados;
    } else {
      this.municipiosDisponiblesResidencial = municipiosFiltrados;
    }
  }

  agregarSeguroMipyme() {
    this.MipymeForm.markAllAsTouched();
    if (this.MipymeForm.valid) {

      // Set departamento y municipios comercial
      if (this.MipymeForm.controls.habilitarComercial.value) {
        const departamentoComercial = this.departamentos.find(dep =>
          dep.divipolad == this.MipymeForm.controls.departamento.value
        );
        const municipioComercial = this.municipiosDisponibles.find(mun =>
          mun.divipolam == this.MipymeForm.controls.municipio.value
        );

        this.MipymeForm.controls.departamento.setValue(departamentoComercial || null);
        this.MipymeForm.controls.municipio.setValue(municipioComercial || null)
      }

      // Set departamento y municipios residencial
      if (this.MipymeForm.controls.habilitarResidencial.value) {
        const departamentoResidencial = this.departamentos.find(dep =>
          dep.divipolad == this.MipymeForm.controls.departamentoResidencial.value
        );
        const municipioResidencial= this.municipiosDisponiblesResidencial.find(mun =>
          mun.divipolam == this.MipymeForm.controls.municipioResid.value
        );

        this.MipymeForm.controls.departamentoResidencial.setValue(departamentoResidencial || null);
        this.MipymeForm.controls.municipioResid.setValue(municipioResidencial || null)
      }

      const formData = { 
        ...this.MipymeForm.getRawValue(), 
        añosConstruccion: this.MipymeForm.controls.aniosConstruccion.value
      };

      delete formData.aniosConstruccion;

      // Enviar los datos al servicio
      this.mipymeService.sendData(formData);
      localStorage.setItem('seguroMipyme', JSON.stringify(formData));

      // Cerrar el modal y enviar los datos modificados
      this.modal.close(formData)
    }
  }




  borrarDatos() {
    this.MipymeForm.reset(); // Reinicia todo el formulario
  }
}

class MipymeForm extends FormGroup {
  constructor() {
    super({
      habilitarComercial: new FormControl(false),
      habilitarResidencial: new FormControl(false),
      tipoConstruccion: new FormControl(''),

      // Campos Comerciales
      razonSocial: new FormControl(''),
      actividadMipyme: new FormControl(''),
      documentoIdentidad: new FormControl(''),
      direccion: new FormControl(''),
      objetosDeValor: new FormControl(''),
      aniosConstruccion: new FormControl(''),
      numeroSotanos: new FormControl(''),
      numeroPisos: new FormControl(''),
      departamento: new FormControl(''),
      municipio: new FormControl(''),

      // Campos Residenciales
      direccionResidencial: new FormControl(''),
      tipoDeViviendaResid: new FormControl(''),
      proteccionDeAlarma: new FormControl(''),
      proteccionDeVigilancia: new FormControl(''),
      departamentoResidencial: new FormControl(''),
      municipioResid: new FormControl(''),
    }, { validators: validacionSeleccionarUnaPregunta });


    this.actualizarValidaciones();

    this.controls.habilitarComercial.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.actualizarValidaciones());
    this.controls.habilitarResidencial.valueChanges.pipe(distinctUntilChanged()).subscribe(() => this.actualizarValidaciones());
  }


  actualizarValidaciones() {
    const esComercial = this.controls.habilitarComercial.value;
    const esResidencial = this.controls.habilitarResidencial.value;

    // Limpiar validaciones previas
    Object.keys(this.controls).forEach(key => {
      this.controls[key].clearValidators();
      this.controls[key].updateValueAndValidity({ emitEvent: false });
    });


    if (esComercial) {
      this.controls.razonSocial.setValidators([Validators.required, Validators.pattern(REGEX.ALPHABETICAL)]);
      this.controls.actividadMipyme.setValidators([Validators.required, Validators.pattern(REGEX.ALPHABETICAL)]);
      this.controls.documentoIdentidad.setValidators([Validators.required, Validators.maxLength(10), Validators.pattern(/^\d*(\.\d+)?$/)]);
      this.controls.direccion.setValidators([Validators.required, Validators.maxLength(50)]);
      this.controls.objetosDeValor.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(9), Validators.pattern(REGEX.NUMERIC)]);
      this.controls.aniosConstruccion.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(3), Validators.pattern(REGEX.NUMERIC)]);
      this.controls.numeroSotanos.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(3), Validators.pattern(REGEX.NUMERIC)]);
      this.controls.numeroPisos.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(3), Validators.pattern(REGEX.NUMERIC)]);
      this.controls.departamento.setValidators([Validators.required]);
      this.controls.municipio.setValidators([Validators.required]);
    }

    if (esResidencial) {
      this.controls.direccionResidencial.setValidators([Validators.required, Validators.maxLength(50)]);
      this.controls.tipoDeViviendaResid.setValidators([Validators.required]);
      this.controls.proteccionDeAlarma.setValidators([Validators.required]);
      this.controls.proteccionDeVigilancia.setValidators([Validators.required]);
      this.controls.departamentoResidencial.setValidators([Validators.required]);
      this.controls.municipioResid.setValidators([Validators.required]);
    }

    this.controls.tipoConstruccion.setValidators([Validators.required]);

    Object.keys(this.controls).forEach(key => this.controls[key].updateValueAndValidity({ emitEvent: false }));
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}


export const tipoVivienda = [
  {
    "id": 1,
    "tipo": 'Casa',
  },
  {
    "id": 2,
    "tipo": 'Apartamento',
  },
]

export const proteccionAlarma = [
  {
    "id": 1,
    "tipo": 'Sin alarma',
  },
  {
    "id": 2,
    "tipo": 'Alarma monitoreada',
  },
]

export const proteccionVigilancia = [
  {
    "id": 1,
    "tipo": 'No posee vigilancia',
  },
  {
    "id": 2,
    "tipo": 'Vigilancia firma especializada',
  },
]

export const TipoDeConstruccion = [
  {
    "id": 1,
    "tipo": 'Grupo 1, Paredes en ladrillo y cemento y armazón en concreto',
  },
  {
    "id": 2,
    "tipo": 'Grupo 2, Paredes en ladrillo Y cemento con techo de en teja sobre armazón metálico',
  },
  {
    "id": 3,
    "tipo": 'Grupo 3, Paredes en ladrillo y con techo de en teja y armazón en madera',
  },
]



export const validacionSeleccionarUnaPregunta: ValidatorFn = (form: FormGroup) => {
  const comercial = form.get('habilitarComercial')?.value;
  const residencial = form.get('habilitarResidencial')?.value;

  return comercial || residencial ? null : { alMenosUnoRequerido: true };
};
