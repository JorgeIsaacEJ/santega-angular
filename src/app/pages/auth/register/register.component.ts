import { Component, OnInit, ViewChild } from '@angular/core';
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
import jsPDF from 'jspdf';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss'],
})
export class RegisterComponent implements OnInit {

    public registerForm: FormGroup = this.fb.group({
    Name: [''],
    Role: [],
    Image: [],
    Email: ['', [ Validators.email ]],
    Telefono: ['', [ Validators.minLength(10), Validators.maxLength(10) ]],
    Status: [],
    Username: ['', [ Validators.minLength(13), Validators.maxLength(13) ]],
    Password: [],
    Password2: [],
    ReferenciaPaycash: [''],
    NumCredito: [''],
    FecNacimiento: [''],
  });
  public formPassword: FormGroup = this.fb.group({
    Telefono: ['', [ Validators.minLength(10), Validators.maxLength(10) ]],
    Password: ['', [ Validators.required ]],
    Password2: ['', [ Validators.required ]],
  });
  public typeDebts: any[] = [];
  public medioContactoDeudorTelefono: any = {};
  public medioContactoDeudorCorreo: any = {};
  public folio: number = 0;
  public paso: number = 1;

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

  //REGISTRO PASO 1
  //Valida los filtros de la persona que se registra
  async ValidaRegistroPaso1() {
    let name = this.registerForm.controls['Name'].value;
    let tel = this.registerForm.controls['Telefono'].value
    let mail = this.registerForm.controls['Email'].value;
    let credito = this.registerForm.controls['NumCredito'].value;
    let nacimiento = this.registerForm.controls['FecNacimiento'].value;
    let rfc = this.registerForm.controls['Username'].value;
    let referencia = this.registerForm.controls['ReferenciaPaycash'].value;
    let Paso_1 = await this.getFindByFilters(tel,mail,referencia,rfc,credito,name,nacimiento);
    //Si avanza del paso 1 Solicitamos aviso de privacidad
    if (Paso_1) {
      this.paso = 2;
      let where1 = "where=Detalle_Medio_Contacto_Deudor.Deudor=" + this.folio.toString();
      let where2 = "where=Credito.Deudor=" + this.folio.toString();
      let where3 = "where=Deudor.Folio=" + this.folio.toString();
      let resp11 = await this.setUsuario(where1, "telefono");
      let resp12 = await this.setUsuario(where1, "correo");
      let resp21 = await this.setCredito(where2);
      let resp31 = await this.setDeudor(where3);
      this.toastrService.success('Usuario verificado!');
    }
    else{
      this.toastrService.info('Datos incorrectos, intentalo de nuevo!');
    }
  }
  //REGISTRO PASO 2
  //Decarga el PDF
  openFile(pdfview : HTMLDivElement){
    const htmlView = pdfview as HTMLElement;
    // TODO: pasar valores de nombre, link de la pagina, etc al avisoComponent
    const doc = new jsPDF({
      unit: 'pt',
      format: 'letter'
    });

    doc.html(htmlView, {
      callback: (doc: jsPDF) => {
        doc.save('Aviso-de-privacidad');
      }
    });
  }
  //Acepta datos PDF
  ValidaRegistroPaso2(){
    if (true) {
      this.paso = 3;
    }
  }
  //REGISTRO PASO 3
  //Confirma celular (Envio de clave de activacion)
  confirmPhone(){
    if (true) {
      this.toastrService.success('Telefono verificado');
      this.paso = 4;
    }
  }
  //Setea cuanta para acceso
  setPassWord(){
    let pass = this.formPassword.controls['Password'].value;
    let pass_confirm = this.formPassword.controls['Password2'].value;
    if(this.paso != 4){
      this.toastrService.info('Por favor confirma tu telefono');
      return;
    }
    if(this.paso == 4 && pass == "" && pass_confirm == ""){
      return;
    }
    if(pass != pass_confirm){
      this.toastrService.info('La contraseña no coincide, intentalo de nuevo!');
      this.formPassword.controls['Password'].setErrors({ invalid: true });
      this.formPassword.controls['Password2'].setErrors({ invalid: true });
      return;
    }
    this.registerForm.controls['Password'].setValue(pass);
    this.registerForm.controls['Password2'].setErrors(pass_confirm);
      //Medio de contacto
      this.medioContactoDeudorTelefono = {
        Folio: 0,
        Deudor: this.folio,
        Medio_de_Contacto: 3,
        Referencia: this.formPassword.controls['Telefono'].value //Siempre toma el segundo numero
      };
      this.medioContactoDeudorCorreo = {
        Folio: 0,
        Deudor: this.folio,
        Medio_de_Contacto: 4,
        Referencia: this.registerForm.controls['Email'].value
      };
      //Registro
      this.register();
  }

  async getFindByFilters(telefono: string, correo: string, referencia: string, rfc: string, credito: string, nombre: string,  fecnacimiento: string): Promise<boolean>{
    let findUser: number = 0;
    let findDeudor: number = 0;
    let findCredito: number = 0;
    let andTelefono = (telefono.length > 1) ? ` Detalle_Medio_Contacto_Deudor.Referencia='${telefono}' and Detalle_Medio_Contacto_Deudor.Medio_de_Contacto = 3`: ``;
    let andCorreo = (correo.length > 1) ? ` Detalle_Medio_Contacto_Deudor.Referencia='${correo}' and Detalle_Medio_Contacto_Deudor.Medio_de_Contacto = 4`: ``;
    let andReferencia = (referencia.length > 1) ? ` Credito.Referencia_Bancaria='${referencia}'`: ``;
    let andCredito = (credito.length > 1) ? ` Credito.Folio=${credito}`: ``;
    let andRFC = (rfc.length > 1) ? ` Deudor.RFC='${rfc}'`: ``;
    let andNombre = (nombre.length > 1) ? ` Deudor.Nombre_Completo='${nombre}'`: ``;
    let andNacimiento = (fecnacimiento.length > 1) ? ` Deudor.Fecha_de_Nacimiento='${fecnacimiento}'`: ``;
    if(andTelefono == "" && andCorreo == "" && andReferencia == "" && andCredito == "" && andRFC == "" && andNombre == "" && andNacimiento == ""){
      return false;
    }
    let filtro_Detalle_Medio_Contacto_Deudor = (andTelefono != "" && andCorreo != "") ? `where=${andTelefono} or${andCorreo}`:
                                                (andTelefono != "" && andCorreo == "") ? `where=${andTelefono}`:
                                                (andTelefono == "" && andCorreo != "") ? `where=${andCorreo}`: ``;
    let filtro_Credito = (andReferencia != "" && andCredito != "") ? `where=${andReferencia} and${andCredito}`:
                          (andReferencia != "" && andCredito == "") ? `where=${andReferencia}`:
                          (andReferencia == "" &&  andCredito != "") ? `where=${andCredito}`: ``;
    let filtro_Deudor = `where=`;
    if(andRFC != ""){
      filtro_Deudor += andRFC;
    }
    if(andNombre != ""){
      if(filtro_Deudor.length > 6) filtro_Deudor += ' and'
      filtro_Deudor += andNombre;
    }
    if(andNacimiento != ""){
      if(filtro_Deudor.length > 6) filtro_Deudor += ' and'
      filtro_Deudor += andNacimiento;
    }
    if(filtro_Detalle_Medio_Contacto_Deudor != ""){//Busqueda de contacto
      findUser = await this.getUsuario(filtro_Detalle_Medio_Contacto_Deudor);
    }
    if(filtro_Credito != ""){//Busqueda del credito
      findCredito = await this.getCredito(filtro_Credito);
    }
    if(filtro_Deudor != "where="){//Busqueda del deudor
      findDeudor = await this.getDeudor(filtro_Deudor);
    }
    //Valida si los filtros son de la misma tabla
    if(findUser != 0 && andTelefono != "" && andCorreo != ""){
      this.folio = findUser;
      return true;
    }
    if(findCredito != 0 && andReferencia != "" && andCredito != ""){
      this.folio = findCredito;
      return true;
    }
    if(findDeudor != 0){
      let contador = 0;
      if(andRFC != ""){
        contador++;
      }
      if(andNombre != ""){
        contador++;
      }
      if(andNacimiento != ""){
        contador++;
      }
      if(contador > 1) {
        this.folio = findDeudor;
        return true;
      }
    }
    //Valido que al menos dos Folios sean iguales
    if((findUser > 0 && findUser == findCredito) || (findCredito > 0 && findCredito == findDeudor) || (findUser > 0 && findUser == findDeudor)){
      this.folio = (findUser > 0) ? findUser : (findCredito > 0) ? findCredito : findDeudor;
      return true;
    }
    return false;
  }

  async getUsuario(filtro: string): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      this.userService.DetalleMedioContactoDeudorListaSelAll(0, 1, filtro).subscribe(
        (User: any) => {
          let value: number = 0;
          if (User && User.RowCount === 0) {
            resolve(0);
          } else {
            value = parseInt(User.Detalle_Medio_Contacto_Deudors[0].Deudor);
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getCredito(filtro: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.paymentService.CreditoListaSelAll(0, 1, filtro).subscribe(
        (Credito: UserCurrentDebtsResponse) => {
          let value: number = 0;
          if (Credito && Credito.RowCount === 0) {
            resolve(0);
          } else {
            value = Credito.Creditos[0].Deudor;
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async getDeudor(filtro: string): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      this.paymentService.DeudorListaSelAll(0, 1, filtro).subscribe(
        (Deudor: UserFolioResponse) => {
          let value: number = 0;
          if (Deudor && Deudor.RowCount === 0) {
            resolve(0);
          } else {
            value = Deudor.Deudors[0].Folio;
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async setUsuario(filtro: string, tipo: string): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      this.userService.DetalleMedioContactoDeudorListaSelAll(0, 1, filtro).subscribe(
        (User: any) => {
          let value: number = 0;
          if (User && User.RowCount === 0) {
            resolve(0);
          } else {
            if(tipo == "telefono"){
              this.registerForm.controls['Telefono'].setValue(User.Detalle_Medio_Contacto_Deudors[0].Referencia);
              this.formPassword.controls['Telefono'].setValue(User.Detalle_Medio_Contacto_Deudors[0].Referencia);
              value = parseInt(User.Detalle_Medio_Contacto_Deudors[0].Deudor);
              resolve(value);
            }
            else{
              this.registerForm.controls['Email'].setValue(User.Detalle_Medio_Contacto_Deudors[0].Referencia);
            }
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async setCredito(filtro: string): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.paymentService.CreditoListaSelAll(0, 1, filtro).subscribe(
        (Credito: UserCurrentDebtsResponse) => {
          let value: number = 0;
          if (Credito && Credito.RowCount === 0) {
            resolve(0);
          } else {
            value = Credito.Creditos[0].Deudor;
            this.registerForm.controls['ReferenciaPaycash'].setValue(Credito.Creditos[0].Referencia_Bancaria);
            this.registerForm.controls['NumCredito'].setValue(Credito.Creditos[0].Folio.toString());
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  async setDeudor(filtro: string): Promise<number>{
    return new Promise<number>((resolve, reject) => {
      this.paymentService.DeudorListaSelAll(0, 1, filtro).subscribe(
        (Deudor: UserFolioResponse) => {
          let value: number = 0;
          if (Deudor && Deudor.RowCount === 0) {
            resolve(0);
          } else {
            value = Deudor.Deudors[0].Folio;
            this.registerForm.controls['Name'].setValue(Deudor.Deudors[0].Nombre_Completo);
            this.registerForm.controls['Username'].setValue(Deudor.Deudors[0].RFC);
            this.registerForm.controls['FecNacimiento'].setValue(Deudor.Deudors[0].Fecha_de_Nacimiento);
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
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
