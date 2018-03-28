import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';

import { VenueComponent } from './venue.component';
import { MapComponent } from './map.component';

@NgModule({
  declarations: [
    VenueComponent,
    MapComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    VenueComponent,
    MapComponent
  ]
})
export class VenueModule { }
