import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotComponent } from './forgot.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ForgotComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: ForgotComponent
    }]),
    ReactiveFormsModule
  ]
})
export class ForgotModule { }
