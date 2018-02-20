import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { ProgramModule } from './program/program.module';
import { SpeakerModule } from './speaker/speaker.module';
import { VenueModule } from './venue/venue.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home.component';

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
    VenueModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
