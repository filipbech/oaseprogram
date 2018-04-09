import { NgModule } from '@angular/core';
import { SpeakerComponent } from './speaker.component';
import { CoreModule } from '../core.module';
import { ProgramModule } from '../program/program.module';

@NgModule({
  declarations: [
    SpeakerComponent
  ],
  imports: [
    CoreModule,
    ProgramModule
  ],
  exports: [
    SpeakerComponent
  ]
})
export class SpeakerModule {}
