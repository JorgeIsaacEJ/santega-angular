import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { NumberWithCommasPipe } from 'src/app/core/pipes/number-with-commas.pipe';
import { LayoutModule } from 'src/app/shared/components/layout/layout.module';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([{
      path: '', component: DashboardComponent
    }]),
    MatIconModule,
    NumberWithCommasPipe,
    LayoutModule,
  ]
})
export class DashboardModule { }
