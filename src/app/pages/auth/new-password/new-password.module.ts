import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPasswordComponent } from './new-password.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NewPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '', component: NewPasswordComponent,
    }])
  ]
})
export class NewPasswordModule { }
