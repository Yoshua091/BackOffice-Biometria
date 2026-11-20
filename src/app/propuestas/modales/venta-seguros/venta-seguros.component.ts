import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';

import { OtpComponent } from './otp/otp.component';
import { BeneficiariosAccidentesPersonlaesComponent } from './beneficiarios-accidentes-personlaes/beneficiarios-accidentes-personlaes.component';
import { AseguradosComponent } from './asegurados/asegurados.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { MipymeComponent } from './mipyme/mipyme.component';


@Component({
  selector: 'app-venta-seguros',
  templateUrl: './venta-seguros.component.html',
  styleUrls: ['./venta-seguros.component.scss']
})
export class VentaSegurosComponent implements OnInit {
  @Input() idSolicitud: any;
  @Input() documento: any;
  @Input() telefono: any
  @Input() fechaNacimiento: any
  @Input() CodigoCIIU: any;
  @Input() marcaSOAT:any
  @Output() modalClosed: EventEmitter<any> = new EventEmitter<any>();
  listaSeguros: any[] = [];
  form: ListadoSegurosForm;
  selectedSeguro: any;
  beneficiariosCount: number = 0;
  beneficiariosAccidentesPersonalesCount: number = 0;
  aseguradosCount: number = 0;
  beneficiariosLista: any[] = [];
  aseguradosLista: any[] = [];
  beneficiarioAccidentesPersonalesLista: any[] = [];
  errorMessage: string = '';
  mostrarValidacionEdad: boolean = false;
  errorMessageExequias: string = '';
  codigosCIIU: any[] = [];
  errorCodigoCIIU: string = '';
  mipymeLista: any[] = []
  mipymeCount:number = 0;


  constructor(
    public modal: NgbActiveModal,
    private api: ApiService,
    private modalNg: NgbModal) {

    this.form = new ListadoSegurosForm({} as FiltroListadoSeguros);
    this.codigosCIIU = codigosCIIURestringidos;
  }

  ngOnInit() {
    this.listarSeguros();
    localStorage.removeItem('beneficiariosList');
    localStorage.removeItem('aseguradosList');
  }

  async listarSeguros() {
    try {
      const response = await this.api.ventaSeguros.listarSeguros();
  
      if (response.data && Array.isArray(response.data)) {
  
        this.listaSeguros = this.marcaSOAT
          ? response.data
          : response.data.filter(s => s.cf !== 78);
  
      } else {
        this.listaSeguros = [];
      }
  
    } catch (e) {
      console.error(e);
    }
  }

  onSelectSeguro() {
    localStorage.removeItem('beneficiariosList');
    localStorage.removeItem('aseguradosList');
    localStorage.removeItem('beneficiariosListAccidentesPersonales');
    localStorage.removeItem('seguroMipyme');

    this.aseguradosCount = 0;
    this.beneficiariosCount = 0;
    this.beneficiariosAccidentesPersonalesCount = 0;
    this.mipymeCount = 0;
    const selectedId = this.form.controls.idSeguro.value;
    this.selectedSeguro = this.listaSeguros.find(seguro => seguro.seguroId === selectedId);
  }

  getSelectedSeguroName(): string {
    const selectedId = this.form.controls.idSeguro.value;
    const selectedSeguro = this.listaSeguros.find(seguro => seguro.seguroId === selectedId);
    return selectedSeguro ? selectedSeguro.nombre : '';
  }

  async listaBeneficiariosAccidentesPersonales(): Promise<void> {

    const fechaNacimiento = new Date(this.fechaNacimiento);
    const edad = this.calculateAge(fechaNacimiento);

    // Validar si el cliente tiene más de 65 años y 364 días
    if (edad.years > 65 || (edad.years === 65 && (edad.months > 11 || edad.days > 30))) {
      this.errorMessage = 'El cliente tiene más de 65 años y no puede adquirir el Seguro Accidentes Personales.';
      return;
    }

    const modalRef = await this.modalNg.open(BeneficiariosAccidentesPersonlaesComponent, {
      centered: true,
      windowClass: 'modal-venta-beneficiarios',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result.then((result) => {
      if (result) {
        this.handleBeneficiariosAccidentesPersonalesResult(result);
      }
    }).catch((error) => {
      console.error('Modal cerrado sin guardar', error);
    });
  }

  private calculateAge(fechaNacimiento: Date): { years: number, months: number, days: number } {
    const hoy = new Date();
    let years = hoy.getFullYear() - fechaNacimiento.getFullYear();
    let months = hoy.getMonth() - fechaNacimiento.getMonth();
    let days = hoy.getDate() - fechaNacimiento.getDate();

    if (days < 0) {
      months--;
      days += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  }

  get esEdadValida(): boolean {
    const fechaNacimiento = new Date(this.fechaNacimiento);
    const edad = this.calculateAge(fechaNacimiento);
    const nombreSeguro = this.getSelectedSeguroName()

    // Validar si el cliente tiene más de 74 años y 364 días
    if (edad.years > 74 || (edad.years === 74 && (edad.months > 11 || edad.days > 30))) {
      this.errorMessageExequias = 'El cliente tiene más de 75 años y no puede adquirir el ' + nombreSeguro + '.';

      return false;
    }

    return true;
  }



  handleBeneficiariosAccidentesPersonalesResult(data: any) {
    this.beneficiariosAccidentesPersonalesCount = data.beneficiarios.length;
    this.beneficiarioAccidentesPersonalesLista = data.beneficiarios
    console.log('Datos recibidos del modal hijo:', data);
  }

  async listaBeneficiarios(): Promise<void> {
    const modalRef = await this.modalNg.open(BeneficiariosComponent, {
      centered: true,
      windowClass: 'modal-venta-beneficiarios',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.tipoSeguro = this.selectedSeguro.seguroId
    modalRef.result.then((result) => {
      if (result) {
        this.handleBeneficiariosResult(result);
      }
    }).catch((error) => {
      console.error('Modal cerrado sin guardar', error);
    });
  }

  handleBeneficiariosResult(data: any) {
    this.beneficiariosCount = data.beneficiarios.length;
    this.beneficiariosLista = data.beneficiarios
    console.log('Datos recibidos del modal hijo:', data);
  }

  async listaAsegurados(): Promise<void> {
    const modalRef = await this.modalNg.open(AseguradosComponent, {
      centered: true,
      windowClass: 'modal-venta-beneficiarios',
      backdrop: 'static',
      keyboard: false
    });
    modalRef.componentInstance.tipoSeguro = this.selectedSeguro.seguroId
    modalRef.result.then((result) => {
      if (result) {
        this.handleAseguradosResult(result);
      }
    }).catch((error) => {
      console.error('Modal cerrado sin guardar', error);
    });
  }

  handleAseguradosResult(data: any) {
    this.aseguradosCount = data.asegurados.length;
    this.aseguradosLista = data.asegurados
    console.log('Datos recibidos del modal hijo:', data);
  }

  async listaMipyme(): Promise<void> {
    const CIIURestringido = this.codigosCIIU.includes(this.CodigoCIIU)

    if (CIIURestringido) {
      this.errorCodigoCIIU = 'No cumple con la actividad económica para tomar este seguro.';
      return;
    }
  
    // 🔹 Recuperar datos previos de localStorage
    const datosGuardados = localStorage.getItem('seguroMipyme');
    const datosMipyme = datosGuardados ? JSON.parse(datosGuardados) : null;
  
    // 🔹 Abrir el modal con los datos guardados (si existen)
    const modalRef = await this.modalNg.open(MipymeComponent, {
      centered: true,
      windowClass: 'modal-venta-beneficiarios',
      backdrop: 'static',
      keyboard: false
    });
  
    modalRef.componentInstance.tipoSeguro = this.selectedSeguro.seguroId;
  
    // 🔹 Pasar los datos al componente del modal
    if (datosMipyme) {
      modalRef.componentInstance.datos = datosMipyme;
    }
  
    // 🔹 Manejar el resultado del modal
    modalRef.result.then((result) => {
      if (result) {
        this.handleMipymeResult(result);
        localStorage.setItem('seguroMipyme', JSON.stringify(result)); // Guardar en localStorage
      }
    }).catch((error) => {
      console.error('Modal cerrado sin guardar', error);
    });
  }

  handleMipymeResult(data: any) {
    this.mipymeCount = data !== undefined ? 1 : 0;
    this.mipymeLista = data
    console.log('Datos recibidos del modal hijo:', data);
  }

  async guardarSeguro() {
    try {
      const seguroData = {
        idSolicitud: this.idSolicitud,
        documento: this.documento,
        seguro: {
          _id: this.selectedSeguro?._id,
          nombre: this.getSelectedSeguroName(),
          valorMensual: this.selectedSeguro?.valorMensual || 0,
          detalles: this.selectedSeguro?.detalles || [],
          beneficiarios: this.beneficiariosLista || [],
          asegurados: this.aseguradosLista || [],
          aprobado: this.selectedSeguro?.aprobado || false,
          cf: this.selectedSeguro?.cf || 0,
          tipoBeneficiario: this.selectedSeguro?.tipoBeneficiario || [],
          firmaId: this.selectedSeguro?.firmaId || '',
          seguroId: this.selectedSeguro?.seguroId || 0,
          edadMinima: this.selectedSeguro?.edadMinima || { dias: 0, meses: 0, anos: 0 },
          edadMaxima: this.selectedSeguro?.edadMaxima || { dias: 0, meses: 0, anos: 0 },
          validarEdad: this.selectedSeguro?.validarEdad || false,
          tipoAsegurado: this.selectedSeguro?.tipoAsegurado || [],
          pdfId: this.selectedSeguro?.pdfId || ''
        }
      };
      const response = await this.api.solicitudes.agregarSeguro(seguroData)
      // Verificar el estado de la respuesta (status 200)
      if (response?.status === 200) {
        console.log('Seguro guardado correctamente', response);

        // Llamar al modal de OTP si la respuesta es exitosa
        await this.abrirModalCodigoAutorizacion();
      } else {
        console.log('Error al guardar el seguro:', response?.mensaje);
      }
    } catch (error) {
      console.log('Error al guardar el seguro', error);
    }
  }

  async guardarSeguroMipyme() {
    try {
      const seguroData = {
        idSolicitud: this.idSolicitud,
        documento: this.documento,
        seguro: {
          _id: this.selectedSeguro?._id,
          nombre: this.getSelectedSeguroName(),
          valorMensual: this.selectedSeguro?.valorMensual || 0,
          detalles: this.selectedSeguro?.detalles || [],
          beneficiarios: [],
          asegurados: [],
          aprobado: this.selectedSeguro?.aprobado || false,
          cf: this.selectedSeguro?.cf || 0,
          tipoBeneficiario: this.selectedSeguro?.tipoBeneficiario || [],
          firmaId: this.selectedSeguro?.firmaId || '',
          mipyme: [this.mipymeLista] || [],
          seguroId: this.selectedSeguro?.seguroId || 0,
          edadMinima: this.selectedSeguro?.edadMinima || { dias: 0, meses: 0, anos: 0 },
          edadMaxima: this.selectedSeguro?.edadMaxima || { dias: 0, meses: 0, anos: 0 },
          validarEdad: this.selectedSeguro?.validarEdad || false,
          tipoAsegurado: this.selectedSeguro?.tipoAsegurado || [],
          pdfId: this.selectedSeguro?.pdfId || ''
        }
      };
      const response = await this.api.solicitudes.agregarSeguro(seguroData)
      // Verificar el estado de la respuesta (status 200)
      if (response?.status === 200) {
        console.log('Seguro guardado correctamente', response);

        // Llamar al modal de OTP si la respuesta es exitosa
        await this.abrirModalCodigoAutorizacion();
      } else {
        console.log('Error al guardar el seguro:', response?.mensaje);
      }
    } catch (error) {
      console.log('Error al guardar el seguro', error);
    }
  }

  async abrirModalCodigoAutorizacion() {
    const modalRef = this.modalNg.open(OtpComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
    // Enviar datos al modal de OTP
    modalRef.componentInstance.documento = this.documento;
    modalRef.componentInstance.idSolicitud = this.idSolicitud;
    modalRef.componentInstance.cf = this.selectedSeguro?.cf;
    modalRef.componentInstance.telefono = this.telefono;
    try {
      // Suscribirse al evento del cierre del modal (validación exitosa del OTP)
      modalRef.componentInstance.modalInfoOtp.subscribe(async (otpValidado) => {
        if (otpValidado) {
          // OTP validado correctamente, cerramos ambos modales
          console.log('OTP validado correctamente:');
          // Cierra el modal del seguro
          this.modal.close();
          // Emitir el evento que indica que el modal ha sido cerrado
          this.modalClosed.emit();
        }
      });
    } catch (error) {
      console.log('El modal fue cerrado sin ingresar un código.');
    }
  }

  async guardarSeguroAccidestesPersonales() {
    try {
      const seguroData = {
        idSolicitud: this.idSolicitud,
        documento: this.documento,
        seguro: {
          _id: this.selectedSeguro?._id,
          nombre: this.getSelectedSeguroName(),
          valorMensual: this.selectedSeguro?.valorMensual || 0,
          detalles: this.selectedSeguro?.detalles || [],
          beneficiarios: this.beneficiarioAccidentesPersonalesLista,
          asegurados: [],
          aprobado: this.selectedSeguro?.aprobado || false,
          cf: this.selectedSeguro?.cf || 0,
          tipoBeneficiario: this.selectedSeguro?.tipoBeneficiario || [],
          firmaId: this.selectedSeguro?.firmaId || '',
          seguroId: this.selectedSeguro?.seguroId || 0,
          edadMinima: this.selectedSeguro?.edadMinima || { dias: 0, meses: 0, anos: 0 },
          edadMaxima: this.selectedSeguro?.edadMaxima || { dias: 0, meses: 0, anos: 0 },
          validarEdad: this.selectedSeguro?.validarEdad || false,
          tipoAsegurado: this.selectedSeguro?.tipoAsegurado || [],
          pdfId: this.selectedSeguro?.pdfId || ''
        }
      };
      // Espera a que se guarde el seguro
      const response = await this.api.solicitudes.agregarSeguro(seguroData);
      // Verificar el estado de la respuesta (status 200)
      if (response?.status === 200) {
        console.log('Seguro guardado correctamente', response);
        // Llamar al modal de OTP si la respuesta es exitosa
        await this.abrirModalCodigoAutorizacion();
      } else {
        console.log('Error al guardar el seguro:', response?.mensaje);
      }
    } catch (error) {
      console.log('Error al guardar el seguro', error);
    }
  }
}


class FiltroListadoSeguros {
  idSeguro: number;
}

class ListadoSegurosForm extends FormGroup {
  constructor(filtro: FiltroListadoSeguros) {
    super({
      idSeguro: new FormControl(filtro.idSeguro)
    });
  }
}

const codigosCIIURestringidos = [
  '9200',
  '5630',
  '329',
  '5530',
  '9609',
  '4741',
  '4775',
  '5011',
  '111',
  '1311',
  '1312',
  '2520',
  '3520',
  '220',
  '1922',
  '3520',
  '2029',
  '3120',
  '2221',
  '2229',
  '2029',
  '119',
  '125',
  '123',
  '9102',
  '9005',
  '3211',
  '3812',
  '3822',
  '2029',
  '4775',
  '5914',
  '0220',
];