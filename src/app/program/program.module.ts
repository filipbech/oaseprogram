import { NgModule } from '@angular/core';
import { ProgramComponent } from './program.component';
import { CoreModule } from '../core.module';
import { ProgramLineComponent } from './program-line.component';
import { ProgramDetailComponent } from './program-detail.component';
import { ProgramRedirectComponent } from './program-redirect.component';
import { ToggleFavoriteComponent } from './toggle-favorite.component';

@NgModule({
  declarations: [
    ProgramComponent,
    ProgramLineComponent,
    ProgramDetailComponent,
    ProgramRedirectComponent,
    ToggleFavoriteComponent
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
