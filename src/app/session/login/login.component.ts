import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {Validators} from '@angular/forms';
import {AuthCredentials} from '../../core/types';
import {SessionService} from '../../core/session.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpErrorResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertButtons, AlertComponent} from '../../shared/alert/alert.component';
import {Md5} from 'ts-md5';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  submitted = false;
  form: LoginForm;
  showSpinner = false;
  showPassword: boolean;

  constructor(
    private router: Router,
    private session: SessionService,
    private spinner: NgxSpinnerService,
    private modal: NgbModal
  ) {
    this.form = new LoginForm({} as AuthCredentials);
  }

  ngOnInit(): void {
    document.body.classList.add('pedro');
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.spinner.show();
      try {
        const resp = await this.session.login(this.form.getRawValue());
        const invalidCodes = ['02AUTHAPIO200-S00003', '02AUTHDAOO200-S00005'];
        this.spinner.hide();

        if (resp.codigo === '02AUTHDAOO200-S00001') {
          await this.router.navigateByUrl(this.session.defaulURL());
        } else if (invalidCodes.includes(resp.codigo)) {
          const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
          result.componentInstance.title = resp.codigo;
          result.componentInstance.description = resp.mensaje;
          result.componentInstance.buttons = AlertButtons.INFO;
        }
      } catch (e) {
        this.spinner.hide();
        if (e instanceof HttpErrorResponse) {
          if (e.error.mensaje) {
            const result = this.modal.open(AlertComponent, {centered: true, size: 'sm'});
            result.componentInstance.title = e.error.codigo;
            result.componentInstance.description = e.error.mensaje;
            result.componentInstance.buttons = AlertButtons.INFO;
          }
        }
      }

    }
  }

}

export class LoginForm extends FormGroup {

  constructor(credentials: AuthCredentials) {
    super({
      usuario: new FormControl(credentials.usuario),
      clave: new FormControl(credentials.clave),
      clavemd5: new FormControl(''),
    });

    this.controls.usuario.setValidators([
      Validators.required,
      Validators.minLength(1),
      // Validators.pattern(/^\w+$|^(?=.*[A-z0-9._%+-]+@[A-z0-9.-]+\.[A-z]{2,4}$)/),
    ]);
    this.controls.clave.setValidators([
      Validators.required,
      Validators.minLength(1),
    ]);

    this.controls.clave.valueChanges.subscribe(value => {
      this.controls.clavemd5.setValue(Md5.hashStr(value));
    });
  }

  getRawValue(): any {
    const value = super.getRawValue();
    value.clave = value.clavemd5;
    value.usuario = value.usuario.toLowerCase();
    delete value.clavemd5;
    return value;
  }

  controlInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }
}

