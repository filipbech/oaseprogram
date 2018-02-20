import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';

import { SpeakerService } from './speaker.service';
import { ISpeaker } from './speaker.model';
import { switchMap } from 'rxjs/operators/switchMap';

@Component({
  selector: 'speaker',
  template: `
    <h1>{{ (speaker | async)?.title }}</h1>
    <p>her er en beskrivelse</p>
    Links til program-punkter med denne taler...
  `
})
export class SpeakerComponent {

  destroy = new Subject();

  speaker = this.activatedRoute.params
    .pipe(
      takeUntil(this.destroy),
      switchMap(params => this.speakerService.getSpeaker(parseFloat(params['speakerId'])))
    );

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private speakerService: SpeakerService
  ) {}
}
