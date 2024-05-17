import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';
import { AvisoComponent } from './aviso/aviso.component';



@NgModule({
  declarations: [
    RegisterComponent,
    AvisoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: RegisterComponent,
    }]),
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideEnvironmentNgxMask()
  ],
})
export class RegisterModule { }
