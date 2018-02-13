import { NgModule } from '@angular/core';
import { ProgramComponent } from './program.component';
import { ProgramService } from './program.service';
import { CoreModule } from '../core.module';

@NgModule({
  declarations: [
    ProgramComponent
  ],
  imports: [
    CoreModule
  ],
  providers: [
    ProgramService
  ],
  exports: [
    ProgramComponent
  ]
})
export class ProgramModule { }
