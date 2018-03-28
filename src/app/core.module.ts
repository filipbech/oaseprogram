import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AccordionComponent } from './accordion.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    AccordionComponent
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    AccordionComponent
  ]
})
export class CoreModule { }

export const API_PREFIX = '/assets';
