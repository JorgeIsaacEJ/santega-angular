import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = this.fb.group({
    usuario: ['', [ Validators.required ]],
    password: ['', [ Validators.required ]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly toastrService: ToastrService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    
    window.scrollTo({ top: 0 });
  }

  login(): void {

    this.authService.login(
      this.loginForm.getRawValue()
    ).subscribe(( value: any ) => {
      
      if ( value && value.Error !== '' ) {

        this.toastrService.info( value.Error );
        return;
      }

      this.getUserData( value.UserId );
    });
  }

  getUserData( id: string ) {

    this.userService.findOne( id ).subscribe(( value: any ) => {

      if ( value && value.RowCount === 0 ) {

        this.toastrService.info('Ha ocurrido un error al iniciar sesión, intentalo de nuevo!');
        return;
      }

      this.toastrService.success(`Bienvenid@ ${ value.Deudors[0].Nombres }`);
      this.router.navigate(['/panel']);
    });
  }
  
}
