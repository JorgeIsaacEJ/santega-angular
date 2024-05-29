import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageModels } from 'src/app/shared/models/message.model';
import { SpartanUsers } from 'src/app/shared/models/user-spartan.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class ForgotComponent implements OnInit {
  folio: number = 0;
  
  public registerForm: FormGroup = this.fb.group({
    Email: ['', [ Validators.required, Validators.email ]]
  });

  constructor(private readonly userService: UserService, 
              private readonly router: Router, 
              private route: ActivatedRoute, 
              private readonly fb: FormBuilder,
              private readonly toastrService: ToastrService,
              private readonly localStorageService: LocalStorageService,) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
  }

  async ChangePassword(){
    let email = this.registerForm.controls['Email'].value;
    let findUser: SpartanUsers = await this.getUsuarioSpartane(`where=Spartan_User.Email='${email}'`);
    if(findUser != null && findUser.RowCount > 0){
      const base64String = btoa(findUser.Spartan_Users[0].Id_User.toString());
      const relativePath = 'crear-contrasenia';
      const URL = this.getFullUrl();
      const Path = URL.split('/')[URL.split('/').length - 1];
      const message = `${URL.replace(Path, relativePath)}${(base64String) ? `?folio=${base64String}` : ''}`;
      this.sendMail(email, message);  	
    }
    else{
      this.toastrService.error(`No se encontro ningun correo, por favor verifica!`);
    }
  }

  async getUsuarioSpartane(filtro: string): Promise<SpartanUsers>{
    return new Promise<SpartanUsers>((resolve, reject) => {
      this.userService.SpartanUserListaSelAll(0, 1, filtro).subscribe(
        (User: any) => {
          let value: SpartanUsers = {
            Spartan_Users: User.Spartan_Users,
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

  sendMail(_mail: string, _contenido: string){
    let model: MessageModels = {
      mail: _mail,
      typeMail: "Notificaciones Plantilla Recuperar",
      codigo: _contenido
    }
    this.userService.PostMail(model).subscribe(( resp ) => {
      if ( resp !== '' ){
        this.toastrService.success(`Tu correo se envio correctamente`);
      } else {
        this.toastrService.error(`Error al enviar correo`);
      }
    });
  }

  getFullUrl(): string {
    return window.location.href;
  }

}
