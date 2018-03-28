import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/observable';

import { switchMap } from 'rxjs/operators/switchMap';
import { ISpeaker } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-speaker',
  template: `
  <div *ngIf="speaker">
    <h1>{{ speaker.name }}</h1>
    <img [src]="speaker.imgUrl" [alt]="speaker.name" />
    <div [innerHTML]="speaker.desc"></div>
    <p>Her taler denne taler??</p>
  </div>
  `
})
export class SpeakerComponent implements OnInit, OnDestroy {
  speaker: ISpeaker;

  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getSpeaker(parseFloat(params['speakerId'])))
    ).subscribe(speaker => this.speaker = speaker);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }
}
