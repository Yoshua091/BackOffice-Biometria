import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { REGEX } from 'src/app/core/constants';
import { BeneficiariosDataService } from 'src/app/core/data/beneficiarios-data.service';

@Component({
  selector: 'app-beneficiarios-accidentes-personlaes',
  templateUrl: './beneficiarios-accidentes-personlaes.component.html',
  styleUrls: ['./beneficiarios-accidentes-personlaes.component.scss']
})
export class BeneficiariosAccidentesPersonlaesComponent implements OnInit {

  beneficiarioForm: BeneficiariosForm;
  beneficiarios: any[] = [];
  errorMsg: string = '';
  tipoDocumento: any[];
  tipoBeneficiario: any[];
  beneficiariosList: any[] = [];
  errorMessage: string = '';
  edadMinima = { years: 18, months: 0, days: 0 };
  edadMaxima = { years: 74, months: 12, days: 30 };

  constructor(public modal: NgbActiveModal, public beneficiariosService: BeneficiariosDataService) {
    this.tipoDocumento = TipoDocumentoCliente;
    this.tipoBeneficiario = TipoBeneficiario;
    
  }

  ngOnInit(): void {
    this.beneficiarioForm = new BeneficiariosForm({} as any);
    const storedBeneficiarios = localStorage.getItem('beneficiariosListAccidentesPersonales');
    this.beneficiariosList = storedBeneficiarios ? JSON.parse(storedBeneficiarios) : [];
  }


  agregarBeneficiario() {
    this.beneficiarioForm.markAllAsTouched();
    if (this.beneficiarioForm.valid) {
      const totalBeneficiarios = this.beneficiariosList.length;

      // Validar que no se agreguen más de 10 beneficiarios
      if (totalBeneficiarios >= 10) {
        this.errorMessage = 'No puedes agregar más de 10 beneficiarios.';
        return;
      }

      // Calcular el porcentaje total actual
      const porcentajeTotal = this.beneficiariosList.reduce((total, b) => total + Number(b.porcentaje), 0);
      const nuevoPorcentaje = Number(this.beneficiarioForm.value.porcentaje);

      // Validar que el porcentaje total no supere el 100%
      if (porcentajeTotal + nuevoPorcentaje > 100) {
        this.errorMessage = 'El porcentaje total no puede superar el 100%.';
        return;
      }

       // Validar que el porcentaje del beneficiario no sea 0%
       if (nuevoPorcentaje === 0) {
        this.errorMessage = 'No puedes agregar un beneficiario con 0%.';
        return;
      }

      // Limpiar el mensaje de error
      this.errorMessage = '';

      // Agregar el beneficiario a la lista
      this.beneficiariosList.push(this.beneficiarioForm.value);

      // Reiniciar el formulario
      this.beneficiarioForm.reset();
    }
  }

  eliminarBeneficiario(index: number) {
    this.beneficiariosList.splice(index, 1);
  }

  formatFecha(fecha: string): string {
    const [day, month, year] = fecha.split('-').map(Number);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  guardarBeneficiarios() {
    // Calcular el porcentaje total actual
    const porcentajeTotal = this.beneficiariosList.reduce((total, b) => total + Number(b.porcentaje), 0);
    const nuevoPorcentaje = Number(this.beneficiarioForm.value.porcentaje);

    // Validar que el porcentaje total no supere el 100%
    if (porcentajeTotal + nuevoPorcentaje > 100) {
      this.errorMessage = 'El porcentaje total no puede superar el 100%.';
      return;
    }

    // Segunda validación: que el porcentaje total sea exactamente 100%
    const porcentajeFinal = this.beneficiariosList.reduce((total, b) => total + Number(b.porcentaje), 0);
    if (porcentajeFinal !== 100) {
      this.errorMessage = 'La suma de los porcentajes de los beneficiarios debe ser igual a 100%.';
      return;
    }

    // Si las validaciones se cumplen, procede a enviar los datos
    const dataToSend = {
      beneficiarios: this.beneficiariosList.map(beneficiario => {
        return {
          ...beneficiario
        };
      })
    };

    // Enviar los datos al servicio
    this.beneficiariosService.sendData(dataToSend);
    localStorage.setItem('beneficiariosListAccidentesPersonales', JSON.stringify(this.beneficiariosList));

    // Cerrar el modal y enviar los datos modificados
    this.modal.close(dataToSend);
  }
}

export const TipoDocumentoCliente = [
  {
    "id": 1,
    "detalle": "Cédula de Ciudadanía",
    "tipo": "C.C",
    "siif": 1
  },
  {
    "id": 4,
    "detalle": "Cédula de Extranjería",
    "tipo": "C.E",
    "siif": 2
  },
  {
    "id": 5,
    "detalle": "Registro Civil",
    "tipo": "R.C",
    "siif": 5
  },
  {
    "id": 6,
    "detalle": "Tarjeta de Identidad",
    "tipo": "T.I",
    "siif": 6
  }
]

export const TipoBeneficiario = [
  {
    "id": 1,
    "tipo": "CÓNYUGE",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 2,
    "tipo": "HIJO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": -6,
        "anos": 0
      },
      "maxima": {
        "dias": 0,
        "meses": 0,
        "anos": 40
      }
    }
  },
  {
    "id": 3,
    "tipo": "MADRE",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 4,
    "tipo": "PADRE",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 5,
    "tipo": "SUEGRO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 6,
    "tipo": "AMIGO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 7,
    "tipo": "TIO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 8,
    "tipo": "PRIMO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  },
  {
    "id": 9,
    "tipo": "ABUELO/A",
    "edad": {
      "minima": {
        "dias": 0,
        "meses": 0,
        "anos": 18
      },
      "maxima": {
        "dias": 30,
        "meses": 12,
        "anos": 74
      }
    }
  }
]

class BeneficiariosForm extends FormGroup {
  constructor(beneficiario: any) {
    super({
      TipoDocumentoCliente: new FormControl(beneficiario.TipoDocumentoCliente),
      documentoIdentidad: new FormControl(beneficiario.documentoIdentidad),
      fechaNacimiento: new FormControl(''),
      nombre: new FormControl(),
      parentesco: new FormControl(''),
      porcentaje: new FormControl(),
      tipoBeneficiario: new FormControl()
    });

    this.controls.TipoDocumentoCliente.setValidators([
      Validators.required,
    ]);

    this.controls.documentoIdentidad.setValidators([
      Validators.required,
      Validators.maxLength(10),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);

    this.controls.tipoBeneficiario.setValidators([
      Validators.required,
    ]);

    this.controls.porcentaje.setValidators([
      Validators.required,
      Validators.maxLength(3),
      Validators.pattern(/^\d*(\.\d+)?$/),
    ]);

    this.controls.nombre.setValidators([
      Validators.required,
      Validators.maxLength(50),
      Validators.pattern(REGEX.ALPHABETICAL)
    ]);
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}
