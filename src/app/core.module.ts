import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccordionComponent } from './accordion.component';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    AccordionComponent,
    SafePipe
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    AccordionComponent,
    SafePipe
  ]
})
export class CoreModule { }

export const API_PREFIX = '/assets';
