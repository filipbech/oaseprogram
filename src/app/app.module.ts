import * as Raven from 'raven-js';
import { environment } from '../environments/environment';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { ProgramModule } from './program/program.module';
import { SpeakerModule } from './speaker/speaker.module';
import { VenueModule } from './venue/venue.module';
import { InfoModule } from './info/info.module';
import { LiveStreamModule } from './livestream/live-stream.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';
import { DataService } from './data.service';
import { OfflineService } from './offline.service';
import { PositionService } from './venue/position.service';
import { TrackingService } from './tracking.service';

if (environment.production) {
  Raven
    .config('https://e712a6f86c784c71b2688bfe78264389@sentry.io/1210403')
    .install();
}

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    try {
      Raven.captureException(err);
    } catch (e) {
      /* can we silently fail, or should we rethrow the error? */
    }
  }
}

const prodProviders = environment.production
  ? [{
    provide: ErrorHandler,
    useClass: RavenErrorHandler
  }]
  : [];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    ProgramModule,
    SpeakerModule,
    VenueModule,
    InfoModule,
    LiveStreamModule
  ],
  providers: [
    ...prodProviders,
    DataService,
    PositionService,
    TrackingService,
    OfflineService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
