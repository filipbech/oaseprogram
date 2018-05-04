import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap,  takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IEvent } from '../data.model';
import { DataService } from '../data.service';
import { clock } from '../icons/clock';
import { locationPin } from '../icons/location';
import { user } from '../icons/user';

@Component({
  selector: 'app-program-detail',
  template: `
    <div *ngIf="event">
      <h3>{{ event.name }}</h3>
      <div class="track" *ngIf="event.trackName">{{event.trackName}}</div>
      <div class="time">
        ${clock}
        {{ event.date.start | date: 'HH:mm' }} - {{ event.date.end | date: 'HH:mm' }} ({{ event.day }})
      </div>
      <div class="location" *ngIf="event.venue">
        ${locationPin}
        <span *ngIf="event.venueName">{{event.venueName}}</span>
      </div>
      <div class="speaker" *ngIf="event.speakerName">
        ${user}
        <a [routerLink]="['/program', 'speaker', event.speaker]" >{{event.speakerName}}</a>
      </div>
      <img [src]="event.imgUrl" *ngIf="event.imgUrl" />
      <div [innerHTML]="event.desc" *ngIf="event.desc"></div>
    </div>
  `
})
export class ProgramDetailComponent implements OnInit, OnDestroy {
  event: IEvent;

  dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getEvent(parseFloat(params['eventId'])))
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
