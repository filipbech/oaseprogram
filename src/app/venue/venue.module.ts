import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';

import { VenueComponent } from './venue.component';
import { MapComponent } from './map.component';
import { VenueService } from './venue.service';



@NgModule({
  declarations: [
    VenueComponent,
    MapComponent
  ],
  imports: [
    CoreModule
  ],
  providers: [
    VenueService
  ],
  exports: [
    VenueComponent,
    MapComponent
  ]
})
export class VenueModule { }
