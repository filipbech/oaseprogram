import { NgModule } from '@angular/core';
import { SpeakerComponent } from './speaker.component';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    SpeakerComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    SpeakerComponent
  ]
})
export class SpeakerModule {}
