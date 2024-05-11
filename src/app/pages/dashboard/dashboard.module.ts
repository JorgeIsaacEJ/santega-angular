import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { NumberWithCommasPipe } from 'src/app/core/pipes/number-with-commas.pipe';
import { LayoutModule } from 'src/app/shared/components/layout/layout.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddMonthToDatePipe } from 'src/app/core/pipes/add-month-to-date.pipe';
import { NgxMaskDirective, NgxMaskPipe, provideEnvironmentNgxMask } from 'ngx-mask';



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
    AddMonthToDatePipe,
    LayoutModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe
  ],
  providers: [
    provideEnvironmentNgxMask()
  ],
})
export class DashboardModule { }
