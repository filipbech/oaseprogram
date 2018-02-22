import { NgModule } from '@angular/core';
import { LiveStreamComponent } from './live-stream.component';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    LiveStreamComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    LiveStreamComponent
  ]
})
export class LiveStreamModule { }
