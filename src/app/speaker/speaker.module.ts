import { NgModule } from '@angular/core';
import { SpeakerComponent } from './speaker.component';
import { SpeakerService } from './speaker.service';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    SpeakerComponent
  ],
  providers: [
    SpeakerService
  ],
  imports: [
    CoreModule
  ],
  exports: [
    SpeakerComponent
  ]
})
export class SpeakerModule {}
