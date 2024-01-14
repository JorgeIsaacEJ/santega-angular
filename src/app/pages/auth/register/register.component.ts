import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup = this.fb.group({
    Name: ['', [ Validators.required ]],
    Apellido_Paterno: ['', [ Validators.required ]],
    Apellido_Materno: ['', [ Validators.required ]],
    Username: ['', [ Validators.required, Validators.minLength(13), Validators.maxLength(13) ]],
    Email: ['', [ Validators.required, Validators.email ]],
    Password: ['', [ Validators.required ]],
  })

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

  register(): void {

    this.authService.register(
      this.registerForm.getRawValue()
    ).subscribe(( value: any ) => {
      
      if ( value && value.Error ) {

        this.toastrService.info( value.Error );
        this.registerForm.controls['Username'].setErrors({ invalid: true });
        this.registerForm.controls['Email'].setErrors({ invalid: true });
        return;
      }

      this.getUserData( value.FolioDeudor );
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
