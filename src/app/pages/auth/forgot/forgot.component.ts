import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SpartanUsers } from 'src/app/shared/models/user-spartan.model';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { UserService } from 'src/app/shared/services/user.service';

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
              private readonly localStorageService: LocalStorageService,) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0 });
  }

  async ChangePassword(){
    let email = (<HTMLInputElement>document.getElementById('email')).value;
    let findUser: SpartanUsers = await this.getUsuarioSpartane(`where=Spartan_User.Email ${email}`);
    if(findUser != null && findUser.RowCount > 0){
      findUser.Spartan_Users[0].Password;
    }

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
            resolve(value);
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

}
