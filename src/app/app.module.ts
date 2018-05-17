import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
    DataService,
    PositionService,
    TrackingService,
    OfflineService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
