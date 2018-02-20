import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './program/program.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { HomeComponent } from './home.component';
import { VenueComponent } from './venue/venue.component';
import { MapComponent } from './venue/map.component';

export const appRoutes: Routes = [
  {
    path: 'program/:date',
    component: ProgramComponent
  },
  {
    path: 'speaker/:speakerId',
    component: SpeakerComponent
  },
  {
    path: 'venue/:venueId',
    component: VenueComponent
  },
  {
    path: 'map',
    component: MapComponent
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
