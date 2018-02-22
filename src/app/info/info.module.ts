import { NgModule } from '@angular/core';
import { InfoPageComponent } from './info-page.component';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    InfoPageComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    InfoPageComponent
  ]
})
export class InfoModule { }
