import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';

import { MapComponent } from './map.component';

@NgModule({
  declarations: [
    MapComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    MapComponent
  ]
})
export class VenueModule { }
