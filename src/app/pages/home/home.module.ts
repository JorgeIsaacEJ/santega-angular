import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([{
      path: '', component: HomeComponent,
    }])
  ],
})
export class HomeModule { }
