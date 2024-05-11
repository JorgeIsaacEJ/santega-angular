import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserCurrentDebtsResponse } from 'src/app/shared/models/user-current-debts-reponse.model';
import { UserFolioResponse } from 'src/app/shared/models/user-folio-response.model';
import { SpartanUsers } from 'src/app/shared/models/user-spartan.model';
import { DetalleMedioContactoDeudor } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DebtService } from 'src/app/shared/services/debt.service';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent implements OnInit {

    public registerForm: FormGroup = this.fb.group({
    Name: [],
    Role: [],
    Image: [],
    Email: ['', [ Validators.required, Validators.email ]],
    Telefono: ['', [ Validators.required, Validators.minLength(10), Validators.maxLength(10) ]],
    Status: [],
    Username: ['', [ Validators.required, Validators.minLength(13), Validators.maxLength(13) ]],
    Password: ['', [ Validators.required ]],
    Password2: ['', [ Validators.required ]],
    ReferenciaPaycash: ['', [ Validators.required ]]
  });
  public typeDebts: any[] = [];
  public medioContactoDeudorTelefono: any = {};
  public medioContactoDeudorCorreo: any = {};

  constructor(
    private readonly fb: FormBuilder,
    private readonly toastrService: ToastrService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly paymentService: PaymentService,
    private readonly router: Router,
    private readonly debtService: DebtService,
  ) {}

  ngOnInit(): void {
    
    window.scrollTo({ top: 0 });
    this.getTypeDebts();
  }

  getTypeDebts(): void {

    this.debtService.getTypeDebts()
      .subscribe(( value: any ) => {

        if ( !value ) return;
        this.typeDebts = value;
    })
  }

  register(): void {

    //this.authService.register(
    this.authService.register_spartane_post(
      this.registerForm.getRawValue()
    ).subscribe(( value: any ) => {
      if ( value && value.Error ) {

        if ( value.Error === 'ERROR_RFC_NO_EXISTE' ) {

          this.toastrService.info('Ha ocurrido un error en el registro, favor de intentarlo mas tarde');
        } else {
          
          this.toastrService.info( value.Error );
        }
        this.registerForm.controls['Username'].setErrors({ invalid: true });
        this.registerForm.controls['Email'].setErrors({ invalid: true });
        return;
      }
      this.setDetalleMedioContactoDeudor(this.medioContactoDeudorTelefono);
      this.setDetalleMedioContactoDeudor(this.medioContactoDeudorCorreo);
      //this.getUserData( value.FolioDeudor );
      this.getUserData(value);
    });
  }

  getUserData( id: string ) {

    this.userService.findOne( id ).subscribe(( spartanUsers: SpartanUsers ) => {
      this.userService.findOneByRFC(spartanUsers.Spartan_Users[0].Username).subscribe(( Deudor: UserFolioResponse ) => {
      if ( Deudor && Deudor.RowCount === 0 ) {

        this.toastrService.info('Ha ocurrido un error al iniciar sesión, intentalo de nuevo!');
        return;
      }

      this.toastrService.success(`Bienvenid@ ${ Deudor.Deudors[0].Nombres }`);
      this.router.navigate(['/panel']);
    });
    });
  }

  //Consulta RFC Y Referencia Paycash
  getValidaRFCReferenciaDeudor() {
    let rfc = this.registerForm.controls['Username'].value;
    let referencia = this.registerForm.controls['ReferenciaPaycash'].value;
    let pass = this.registerForm.controls['Password'].value;
    let pass_confirm = this.registerForm.controls['Password2'].value;
    let Deudorwhere = `where=Deudor.RFC='${rfc}'`;
    if(pass != pass_confirm){
      this.toastrService.info('La contraseña no coincide, intentalo de nuevo!');
      this.registerForm.controls['Password'].setErrors({ invalid: true });
      this.registerForm.controls['Password2'].setErrors({ invalid: true });
      return;
    }
      this.paymentService.DeudorListaSelAll(0, 1, Deudorwhere).subscribe(( Deudor: UserFolioResponse ) => {
      if ( Deudor && Deudor.RowCount === 0 ) {
        this.toastrService.info('El RFC no existe, intentalo de nuevo!');
        this.registerForm.controls['Username'].setErrors({ invalid: true });
        return;
      }
      let Creditowhere = `where=Credito.Referencia_Bancaria='${referencia}'`;
      this.paymentService.CreditoListaSelAll(0, 1, Creditowhere).subscribe(( Credito: UserCurrentDebtsResponse ) => {
      if ( Credito && Credito.RowCount === 0 ) {
        this.toastrService.info('La referencia no existe, intentalo de nuevo!');
        this.registerForm.controls['ReferenciaPaycash'].setErrors({ invalid: true });
        return;
      }
      if(Credito.Creditos[0].Deudor != Deudor.Deudors[0].Folio ){
        this.toastrService.info('La referencia no corresponde al RFC, intentalo de nuevo!');
        this.registerForm.controls['ReferenciaPaycash'].setErrors({ invalid: true });
        return;
      }
      //Ambos existen
      this.registerForm.controls['Name'].setValue(Deudor.Deudors[0].Nombre_Completo);
      this.registerForm.controls['Role'].setValue(19);
      this.registerForm.controls['Image'].setValue(null);
      this.registerForm.controls['Status'].setValue(1);
      //Medio de contacto
      this.medioContactoDeudorTelefono = {
        Folio: 0,
        Deudor: Deudor.Deudors[0].Folio,
        Medio_de_Contacto: 3,
        Referencia: this.registerForm.controls['Telefono'].value
      };
      this.medioContactoDeudorCorreo = {
        Folio: 0,
        Deudor: Deudor.Deudors[0].Folio,
        Medio_de_Contacto: 4,
        Referencia: this.registerForm.controls['Email'].value
      };
      //Registro
      this.register();
    });
    });
  }

  setDetalleMedioContactoDeudor(detalleMedioDeContactoDeudor: DetalleMedioContactoDeudor){
    this.userService.setDetalleMedioContactoDeudor(detalleMedioDeContactoDeudor).subscribe(( value: any ) => {
      if ( value && value.RowCount === 0 ) {
        this.toastrService.info('Ha ocurrido un error al registrar los datos de contact, intentalo de nuevo!');
        return;
      }
    });
  }
}
