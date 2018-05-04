import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle  } from '@angular/router';

import { ProgramComponent } from './program/program.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { HomeComponent } from './home.component';
import { MapComponent } from './venue/map.component';
import { ProgramDetailComponent } from './program/program-detail.component';
import { ProgramRedirectComponent } from './program/program-redirect.component';
import { InfoPageComponent } from './info/info-page.component';
import { LiveStreamComponent } from './livestream/live-stream.component';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/program'
  },
  {
    path: 'program',
    component: ProgramRedirectComponent
  },
  {
    path: 'program/:date',
    component: ProgramComponent
  },
  {
    path: 'program/event/:eventId',
    component: ProgramDetailComponent
  },
  {
    path: 'program/speaker/:speakerId',
    component: SpeakerComponent
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: 'livestream',
    component: LiveStreamComponent,
  },
  {
    path: 'info',
    component: InfoPageComponent,
  },
  {
    path: '**',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
