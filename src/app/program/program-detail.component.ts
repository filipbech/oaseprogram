import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap,  takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IEvent } from '../data.model';
import { DataService, dayNames } from '../data.service';
import { clock } from '../icons/clock';
import { locationPin } from '../icons/location';
import { category } from '../icons/category';
import { user } from '../icons/user';


@Component({
  selector: 'app-program-detail',
  template: `
    <div *ngIf="event">
      <h3>{{ event.name }}</h3>
      <div class="track" *ngIf="event.trackName">
        ${category}
        <ng-container *ngFor="let track of event.trackDetails; let isLast=last">
          <a [routerLink]="['/program']" [queryParams]="{track: track.id}">{{track.name}}</a>{{isLast ? '' : ', '}}
        </ng-container>
      </div>
      <div class="time">
        ${clock}
        {{ event.date.start | date: 'HH:mm' }} - {{ event.date.end | date: 'HH:mm' }} ({{ event.day }})
      </div>
    <div class="location" *ngIf="event.venue">
        ${locationPin}
        <a [routerLink]="['/map']" [queryParams]="{venue:event.venue}">{{event.venueName}}</a>
        <div class="point">{{event.venueNumber}}</div>
      </div>
      <div class="speaker" *ngIf="event.speakersDetails.length">
        ${user}
        <a *ngFor="let speaker of event.speakersDetails" [routerLink]="['/program', 'speaker', speaker.id]" >{{speaker.name}}</a>
      </div>
      <img [src]="event.imgUrl" *ngIf="event.imgUrl" />
      <div [innerHTML]="event.desc" *ngIf="event.desc"></div>
    </div>
  `
})
export class ProgramDetailComponent implements OnInit, OnDestroy {
  event: IEvent;

  dayNames = dayNames;

  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getEvent(parseFloat(params['eventId']))),
      filter(event => !!event)
    ).subscribe(event => {
      if (event && event.date) { event['day'] = this.dayNames[new Date(event.date.start).getDay()]; }
      this.event = event;
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
