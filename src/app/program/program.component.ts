import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataService, IEvent, ITrack, dayNames, ITrackCategory } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable,  Subject,  BehaviorSubject } from 'rxjs';
import { takeUntil,  switchMap,  tap, combineLatest, map, take, filter, share, distinctUntilChanged } from 'rxjs/operators';
import { arrow } from '../icons/arrow';

@Component({
  selector: 'app-program',
  template: `
  <div class="program-header">
  <h3>{{ dayNames[displayDate.getDay()] }}</h3>
  <a *ngIf="(nextPreviousLinkInfo | async)?.prev"
    [routerLink]="['/program', (nextPreviousLinkInfo | async)?.prev]"
    [queryParams]="trackQuery"
    aria-label="Forrige dag"
    class="previous-day">${arrow}</a>
  <a *ngIf="(nextPreviousLinkInfo | async)?.next"
    [routerLink]="['/program', (nextPreviousLinkInfo | async)?.next]"
    [queryParams]="trackQuery"
    aria-label="Næste dag"
    class="next-day">${arrow}</a>
  </div>

  <label>Viser:
    <select (change)="onChange($event.target.value)" #select>
      <option value="1">Mine favoritter</option>
      <option value="0">Alle spor</option>
      <optgroup *ngFor="let trackCategory of tracks | async" [label]="trackCategory.type">
        <option *ngFor="let track of trackCategory.tracks" [value]="track.id">{{ track.name }}</option>
      <optgroup>
    </select>
  </label>

  <div class="app-program-block">
    <app-program-line *ngFor="let event of events | async" [event]="event" (toggleFav)="onToggleFav($event)"></app-program-line>
    <div *ngIf="!hasEvents" class="no-events">
      Ingen programpunkter matcher dine valg.<br/>
      <button (click)="onChange('reset')">Vis alle</button>
    </div>
  </div>
  `
})
export class ProgramComponent implements OnDestroy, OnInit {

  @ViewChild('select') select: ElementRef;

  hasEvents = true;

  trackQuery = {};

  destroy = new Subject();

  tracks: Observable<ITrackCategory[]> = this.dataService.tracks$.pipe(filter(trackList => !!trackList.length))

  displayDate: Date;
  dayNames = dayNames;

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
      distinctUntilChanged(),
      combineLatest(this.filterSubject.pipe(distinctUntilChanged())),
      map(([events, selectedTrack]) => {
        return events.filter((event: IEvent) => {
          if (selectedTrack === 1) {
            return event.isFavorite;
          }
          return selectedTrack ? event.tracks.indexOf(selectedTrack) > -1 : true;
        });
      }),
      tap(events => {
        this.hasEvents = !!events.length;
      })
    );

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(
      map(queryparams => queryparams.track),
      takeUntil(this.destroy),
      combineLatest(this.tracks),
      take(1)
    )
    .subscribe(([initialTrack, _unused]) => {
      setTimeout(_ => {
        if (initialTrack) {
          this.onChange(initialTrack);
          this.select.nativeElement.value = initialTrack;
        }
      }, 0);
    });

    this.filterSubject.pipe(takeUntil(this.destroy)).subscribe(value => {
      history.replaceState('', '', location.pathname + '?track=' + value);
    });
  }

  onToggleFav(event) {
    this.dataService.toggleFavorite(event);
  }

  onChange(value) {
    if (value === 'reset') {
      // set by remove-filter Button
      value = 0;
      this.select.nativeElement.value = value;
    }
    this.trackQuery = { track: value };
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
