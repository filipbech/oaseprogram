import { NgModule } from '@angular/core';
import { ProgramComponent } from './program.component';
import { CoreModule } from '../core.module';
import { ProgramLineComponent } from './program-line.component';
import { ProgramDetailComponent } from './program-detail.component';
import { ProgramRedirectComponent } from './program-redirect.component';

@NgModule({
  declarations: [
    ProgramComponent,
    ProgramLineComponent,
    ProgramDetailComponent,
    ProgramRedirectComponent
  ],
  imports: [
    CoreModule
  ],
  exports: [
    ProgramComponent,
    ProgramLineComponent,
    ProgramDetailComponent,
    ProgramRedirectComponent
  ]
})
export class ProgramModule { }
