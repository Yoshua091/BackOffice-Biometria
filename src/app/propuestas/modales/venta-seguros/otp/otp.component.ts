import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/core/data/api.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  @Input() documento: any;
  @Input() idSolicitud: any;
  @Input() telefono: any;
  @Input() cf: any;
  @Output() modalInfoOtp: EventEmitter<any> = new EventEmitter<any>();

  codigo: string = '';
  errorMessage: string = '';
  token: string = '';

  constructor(public modal: NgbActiveModal, private api: ApiService,) { }

  ngOnInit(): void {
    this.enviarOTP()
  }

  async enviarOTP() {
    try {
      const element = {
        idSolicitud: this.idSolicitud,
        documento: this.documento,
        cf: this.cf,
        telefono: this.telefono
      }
      const response = await this.api.ventaSegurosOtp.enviarOTP(element)
      console.log('OTP enviado', response)
      this.token = response.data[0].token
    } catch (error) {

    }
  }

  async confirmarCodigo() {
    try {
      const element = {
        idSolicitud: this.idSolicitud,
        documento: this.documento,
        cf: this.cf,
        token: this.token,
        codigo: this.codigo
      }
      const response = await this.api.ventaSegurosOtp.validarOTP(element)
      console.log('OTP enviado', response.data)
      this.modal.close();
      this.modalInfoOtp.emit(true);
    } catch (error) {

    }
  }



}
