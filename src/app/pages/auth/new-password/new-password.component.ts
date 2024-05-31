import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpartanUsers } from 'src/app/shared/models/user-spartan.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  //styleUrls: ['./new-password.component.scss'],
  styleUrls: ['../login/login.component.scss']
})
export class NewPasswordComponent {
  folio: number = 0;
  public registerForm: FormGroup = this.fb.group({
    Id_User: [],
    Name: [''],
    Role: [],
    Image: [],
    Email: ['', [ Validators.required, Validators.email ]],
    Status: [],
    Username: ['', [ Validators.minLength(13), Validators.maxLength(13) ]],
    Password: [],
  });
  public formPassword: FormGroup = this.fb.group({
    Password: ['', [ Validators.required  ]],
    Password2: ['', [ Validators.required  ]]
  });

  constructor(private readonly userService: UserService, 
    private readonly router: Router, 
    private route: ActivatedRoute, 
    private readonly fb: FormBuilder,
    private readonly toastrService: ToastrService,
    private readonly authService: AuthService,) {}

    ngOnInit(): void {
      window.scrollTo({ top: 0 });
      this.obtenerFolio();
    }

    async ChangePassword(){
      let password = this.formPassword.controls['Password'].value;
      let password2 = this.formPassword.controls['Password2'].value;
      // let findUser: SpartanUsers = await this.getUsuarioSpartane(`where=Spartan_User.Username IN (SELECT TOP 1 RFC FROM [cobranza].[dbo].[Deudor] WHERE Folio = ${this.folio.toString()})`);
      let findUser: SpartanUsers = await this.getUsuarioSpartane(`where=Spartan_User.Id_User= ${this.folio.toString()}`);
      if(findUser != null && findUser.RowCount > 0){
        if(password != password2){
          this.toastrService.info(`La contraseña no es igual, por favor verifique su contraseña`);
          return
        }
        this.registerForm.controls['Id_User'].setValue(findUser.Spartan_Users[0].Id_User);
        this.registerForm.controls['Name'].setValue(findUser.Spartan_Users[0].Name);
        this.registerForm.controls['Role'].setValue(findUser.Spartan_Users[0].Role);
        this.registerForm.controls['Image'].setValue(findUser.Spartan_Users[0].Image);
        this.registerForm.controls['Email'].setValue(findUser.Spartan_Users[0].Email);
        this.registerForm.controls['Status'].setValue(findUser.Spartan_Users[0].Status);
        this.registerForm.controls['Username'].setValue(findUser.Spartan_Users[0].Username);
        this.registerForm.controls['Password'].setValue(password);

        this.authService.register_spartane_post(
          this.registerForm.getRawValue()
        ).subscribe(( value: any ) => {
          if ( value && value.Error ) {
    
            if ( value.Error === 'ERROR_RFC_NO_EXISTE' ) {
    
              this.toastrService.info('Ha ocurrido un error en el registro, favor de intentarlo mas tarde');
            } else {
    
              this.toastrService.info( value.Error );
            }
            this.formPassword.controls['password'].setErrors({ invalid: true });
            this.formPassword.controls['password2'].setErrors({ invalid: true });
            return;
          }
          this.router.navigate(['/auth/iniciar-sesion']);
        });
      }
  
    }

    obtenerFolio():void{
      this.route.queryParams.subscribe(params => {
        if(params['folio'] === undefined || params['folio'] == "" || params['folio'] == "0")
        {
          this.toastrService.info(`Folio incorrecto, por favor verifique su URL`);
          return
        }
        this.folio =  parseInt(atob(params['folio']));
      });
    }

    async getUsuarioSpartane(filtro: string): Promise<SpartanUsers>{
      return new Promise<SpartanUsers>((resolve, reject) => {
        this.userService.SpartanUserListaSelAll(0, 1, filtro).subscribe(
          (User: any) => {
            let value: SpartanUsers = {
              Spartan_Users: [],
              RowCount: 0
            };
            if (User && User.RowCount === 0) {
              resolve(value);
            } else {
              resolve(User);
            }
          },
          (error) => {
            reject(error);
          }
        );
      });
    }
}
