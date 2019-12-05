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
import { TrackListComponent } from './tracks/track-list.component';
import { TrackDetailComponent } from './tracks/track-detail.component';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/program'
  },
  {
    path: 'program',
    data: { noIndex: false },
    component: ProgramRedirectComponent
  },
  {
    path: 'program/:date',
    data: { noIndex: false },
    component: ProgramComponent
  },
  {
    path: 'program/event/:eventId',
    data: { noIndex: false },
    component: ProgramDetailComponent
  },
  {
    path: 'program/speaker/:speakerId',
    data: { noIndex: false },
    component: SpeakerComponent
  },
  {
    path: 'map',
    data: { noIndex: true },
    component: MapComponent,
  },
  {
    path: 'livestream',
    data: { noIndex: true },
    component: LiveStreamComponent,
  },
  {
    path: 'info',
    data: { noIndex: true },
    component: InfoPageComponent,
  },
  {
    path: 'spor',
    data: { noIndex: true },
    component: TrackListComponent
  },
  {
    path: 'spor/:id',
    data: { noIndex: true },
    component: TrackDetailComponent
  },
  {
    path: '**',
    data: { noIndex: false },
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
