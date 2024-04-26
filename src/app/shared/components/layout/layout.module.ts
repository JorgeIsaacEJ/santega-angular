import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { ReferenceComponent } from 'src/app/pages/reference/reference.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PageLoaderComponent,
    ReferenceComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    PageLoaderComponent,
    ReferenceComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
  ]
})
export class LayoutModule { }
