import { Component, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DataService, IEvent, ITrack } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { switchMap } from 'rxjs/operators/switchMap';
import { tap } from 'rxjs/operators/tap';
import { arrow } from '../icons/arrow';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/operators/combineLatest';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-program',
  template: `
  <div class="program-header">
  <h3>{{ dayNames[displayDate.getDay()] }}</h3>
  <a *ngIf="(nextPreviousLinkInfo | async)?.prev"
    [routerLink]="['/program', (nextPreviousLinkInfo | async)?.prev]"
    class="previous-day">${arrow}</a>
  <a *ngIf="(nextPreviousLinkInfo | async)?.next"
    [routerLink]="['/program', (nextPreviousLinkInfo | async)?.next]"
    class="next-day">${arrow}</a>
  </div>

  <label>Viser:
    <select (change)="onChange($event.target.value)" #select>
      <option value="">Alle spor</option>
      <option *ngFor="let track of tracks | async" [value]="track.id">{{ track.name }}</option>
    </select>
  </label>

  <div class="app-program-block">
    <app-program-line *ngFor="let event of events | async" [event]="event"></app-program-line>
    <div *ngIf="(events | async)?.length < 1" class="no-events">
      Ingen programpunkter matcher dine valg.<br/>
      <button (click)="onChange('reset')">Vis alle</button>
    </div>
  </div>
  `
})
export class ProgramComponent implements OnDestroy {

  @ViewChild('select') select: ElementRef;

  destroy = new Subject();

  tracks: Observable<ITrack[]> = this.dataService.tracks$;

  displayDate: Date;
  dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

  nextPreviousLinkInfo = this.activatedRoute.params
    .pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.nextPreviousDayLinkInfo(params['date']))
    );

  filterSubject = new BehaviorSubject(0);

  events: Observable<IEvent[]> = this.activatedRoute.params
    .pipe(
      takeUntil(this.destroy),
      tap(params => {
        this.displayDate = new Date(params['date']);
      }),
      switchMap(params => this.dataService.getEventsByDate(params['date'])),
      combineLatest(this.filterSubject.asObservable()),
      map(([events, filter]) => {
        return events.filter((event: IEvent) => filter ? event.tracks[0] === filter : true);
      })
    );

  onChange(value) {
    if (value === 'reset') {
      // set by remove-filter Button
      value = '';
      this.select.nativeElement.value = value;
    }
    this.filterSubject.next(parseFloat(value));
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
  constructor(
    private dataService: DataService,
    private activatedRoute: ActivatedRoute
  ) {}
}
