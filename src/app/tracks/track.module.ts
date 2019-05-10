import { NgModule } from '@angular/core';
import { CoreModule } from '../core.module';
import { TrackDetailComponent } from './track-detail.component';
import { TrackListComponent } from './track-list.component';


@NgModule({
  declarations: [
    TrackDetailComponent,
    TrackListComponent
  ],
  imports: [
    CoreModule
  ]
})
export class TrackModule { }
