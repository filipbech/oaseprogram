import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil ,  switchMap, filter } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { ISpeaker, IEvent } from '../data.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-speaker',
  template: `
  <div *ngIf="speaker">
    <h3>{{ speaker.name }}</h3>
    <img [src]="speaker.imgUrl" [alt]="speaker.name" *ngIf="speaker.imgUrl" />
    <div [innerHTML]="speaker.desc"></div>

    <h3>Her kan du møde {{speaker.name}}</h3>
    <div class="app-program-block">
      <app-program-line *ngFor="let event of events | async" [event]="event" [displayDay]="true"></app-program-line>
    </div>
  </div>
  `
})
export class SpeakerComponent implements OnInit, OnDestroy {
  speaker: ISpeaker;

  destroy = new Subject();
  events: Observable<IEvent[]>;

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getSpeaker(parseFloat(params['speakerId']))),
      filter(speaker => !!speaker)
    ).subscribe(speaker => {
      this.speaker = speaker;
      this.events = this.dataService.getEventsBySpeaker(speaker.id);
    });
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
