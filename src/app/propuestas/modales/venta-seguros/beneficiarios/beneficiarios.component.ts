import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { REGEX } from 'src/app/core/constants';
import { BeneficiariosDataService } from 'src/app/core/data/beneficiarios-data.service';

@Component({
  selector: 'app-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.scss']
})
export class BeneficiariosComponent implements OnInit {
  @Input() tipoSeguro: any;
  beneficiarioForm: BeneficiariosForm;
  beneficiarios: any[] = [];
  errorMsg: string = '';
  tipoDocumento: any[];
  tipoBeneficiario: any[];
  beneficiariosList: any[] = [];
  errorMessage: string = '';
  edadMinima = { years: 18, months: 0, days: 0 };
  edadMaxima = { years: 74, months: 11, days: 30 };
  maxDate: any;

  constructor(public modal: NgbActiveModal, public beneficiariosService: BeneficiariosDataService) {
    this.tipoDocumento = TipoDocumentoCliente;
    const today = new Date();
    const maxDateObj = new Date();
    maxDateObj.setDate(today.getDate() + 90); // Sumar 90 días a la fecha actual

    this.maxDate = {
      year: maxDateObj.getFullYear(),
      month: maxDateObj.getMonth() + 1,
      day: maxDateObj.getDate()
    };
  }

  mostrarTiposBeneficiarios() {
    if (this.tipoSeguro === 2) {
      this.tipoBeneficiario = TipoBeneficiario.filter(tipo => tipo.id === 1 || tipo.id === 2);
    } else if (this.tipoSeguro === 3) {
      this.tipoBeneficiario = TipoBeneficiario.filter(tipo => tipo.id !== 6);
    }

  }

  ngOnInit(): void {
    this.mostrarTiposBeneficiarios()
    this.beneficiarioForm = new BeneficiariosForm({} as any);
    const storedBeneficiarios = localStorage.getItem('beneficiariosList');
    this.beneficiariosList = storedBeneficiarios ? JSON.parse(storedBeneficiarios) : [];
  }

  validateAge(): boolean {
    const fechaNacimientoString = this.beneficiarioForm.get('fechaNacimiento').value;
    const fechaNacimiento = new Date(this.transformDateFormat(fechaNacimientoString));

    if (isNaN(fechaNacimiento.getTime())) {
      return false;
    }

    const edad = this.calculateAge(fechaNacimiento);
    return this.isAgeInRange(edad);
  }

  transformDateFormat(fechaString: string): string {
    // Suponiendo que fechaString está en formato DD-MM-YYYY
    const [day, month, year] = fechaString.split('-').map(Number);
    const fecha = new Date(year, month - 1, day); // Los meses en JavaScript son 0 indexados

    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Meses son 0 indexados
    const dd = String(fecha.getDate()).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}`;
  }

  private calculateAge(fechaNacimiento: Date): { years: number, months: number, days: number } {
    const today = new Date();
    let years = today.getFullYear() - fechaNacimiento.getFullYear();
    let months = today.getMonth() - fechaNacimiento.getMonth();
    let days = today.getDate() - fechaNacimiento.getDate();

    // Ajustar si el día del mes actual es menor que el día de nacimiento
    if (days < 0) {
      months--;
      // Obtener el número de días del mes anterior
      const prevMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
      const prevMonthDays = new Date(today.getFullYear(), prevMonth + 1, 0).getDate();
      days += prevMonthDays;
    }

    // Ajustar si el mes actual es menor que el mes de nacimiento
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  private isAgeInRange(age: { years: number, months: number, days: number }): boolean {
    const min = this.edadMinima;
    let max = this.edadMaxima;

    // Si el beneficiario es de tipo "Hijo/a" (id: 2), la edad máxima es 40 años
    if (this.beneficiarioForm.controls.tipoBeneficiario.value?.id === 2) {
      return age.years <= 40; // No debe superar los 40 años
    }

    if (age.years < min.years || age.years > max.years) {
      return false;
    }

    if (age.years === min.years && (age.months < min.months || (age.months === min.months && age.days < min.days))) {
      return false;
    }

    if (age.years === max.years && (age.months > max.months || (age.months === max.months && age.days > max.days))) {
      return false;
    }

    return true;
  }


  private buildAgeMessage(fechaNacimiento: Date): string {
    const { years, months, days } = this.calculateAge(fechaNacimiento);
    return `El beneficiario tiene una edad de ${years} años, ${months} meses y ${days} días. Debe tener una edad entre los 18 años, 0 meses, 0 días y 74 años, 11 meses, 30 días.`;
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
  
      // Validar que la edad esté dentro del rango permitido (18–74, salvo HIJO/A)
      if (!this.validateAge() && this.beneficiarioForm.controls.tipoBeneficiario.value.id !== 2) {
        const fechaNacimientoString = this.beneficiarioForm.get('fechaNacimiento').value;
        const fechaNacimiento = new Date(this.transformDateFormat(fechaNacimientoString));
        const ageMessage = this.buildAgeMessage(fechaNacimiento);
        this.errorMessage = ageMessage;
        return;
      }
  
      const fechaNacimientoString = this.beneficiarioForm.get('fechaNacimiento').value;
      const fechaNacimiento = new Date(this.transformDateFormat(fechaNacimientoString));
      const edad = this.calculateAge(fechaNacimiento); // <-- NUEVO
      const tipoDoc = this.beneficiarioForm.controls.TipoDocumentoCliente.value; // <-- NUEVO
  
      // --- VALIDACIÓN NUEVA: TIPO DOC VS EDAD ---
      if (tipoDoc?.id === 1 && edad.years < 18) { // Cédula de Ciudadanía
        this.errorMessage = 'Para Cédula de Ciudadanía el beneficiario debe ser mayor de 18 años.';
        return;
      }

      if (tipoDoc?.id === 4 && edad.years < 18) {
        this.errorMessage = 'Para Cédula de Extranjería el beneficiario debe ser mayor de 18 años.';
        return;
      }
      
      // Registro Civil → Menor de 18
      if (tipoDoc?.id === 5 && edad.years >= 18) {
        this.errorMessage = 'Para Registro Civil el beneficiario debe ser menor de 18 años.';
        return;
      }
  
      if (tipoDoc?.id === 6 && edad.years >= 18) { // Tarjeta de Identidad
        this.errorMessage = 'Para Tarjeta de Identidad el beneficiario debe ser menor de 18 años.';
        return;
      }
      // --- FIN VALIDACIÓN NUEVA ---
  
      // Validar edad máxima de 40 años para beneficiario "HIJO/A" (id: 2)
      if (this.beneficiarioForm.controls.tipoBeneficiario.value.id === 2 && edad.years > 40) {
        this.errorMessage = 'El beneficiario HIJO/A no puede tener más de 40 años.';
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
  
      localStorage.setItem('beneficiariosList', JSON.stringify(this.beneficiariosList));
  
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
      return; // 
    }

    // Segunda validación: que el porcentaje total sea exactamente 100%
    const porcentajeFinal = this.beneficiariosList.reduce((total, b) => total + Number(b.porcentaje), 0);
    if (porcentajeFinal !== 100) {
      this.errorMessage = 'La suma de los porcentajes de los beneficiarios debe ser igual a 100%.';
      return;
    }
    const formatFecha = (fecha: string): string => {
      const [day, month, year] = fecha.split('-').map(Number);
      return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    };
    const dataToSend = {
      beneficiarios: this.beneficiariosList.map(beneficiario => {
        return {
          ...beneficiario,
          fechaNacimiento: formatFecha(beneficiario.fechaNacimiento)
        };
      })
    };

    // Enviar los datos al servicio
    this.beneficiariosService.sendData(dataToSend);

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
  }
]

class BeneficiariosForm extends FormGroup {
  constructor(beneficiario: any) {
    super({
      TipoDocumentoCliente: new FormControl(beneficiario.TipoDocumentoCliente),
      documentoIdentidad: new FormControl(beneficiario.documentoIdentidad),
      fechaNacimiento: new FormControl(),
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

    this.controls.fechaNacimiento.setValidators([
      Validators.required,
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
