import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataService, IEvent, ITrack, dayNames, ITrackCategory } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable,  Subject,  BehaviorSubject } from 'rxjs';
import { takeUntil,  switchMap,  tap, combineLatest, map, take, filter, share, distinctUntilChanged } from 'rxjs/operators';
import { arrow } from '../icons/arrow';
import { MatSelect } from '@angular/material';

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
  <mat-form-field>
    <mat-select #select (change)="onChange($event)" multiple [value]="initialFilter">
      <mat-option [value]="1">Mine favoritter</mat-option>
      <mat-optgroup *ngFor="let trackCategory of tracks | async" [label]="trackCategory.type">
        <mat-option *ngFor="let track of trackCategory.tracks" [value]="track.id">{{ track.name }}</mat-option>
      </mat-optgroup>
    </mat-select>
  </mat-form-field>
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

  @ViewChild('select') select: MatSelect;

  hasEvents = true;

  initialFilter;

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

  filterSubject = new BehaviorSubject([]);

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
          if (selectedTrack.length < 1) {
            return true;
          }
          if (selectedTrack[0] === 1) {
            return event.isFavorite;
          }
          for (let i = 0; i < selectedTrack.length; i++) {
            if (event.tracks.indexOf(selectedTrack[i]) > -1) {
              return true;
            }
          }
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
          this.initialFilter =
            (Array.isArray(initialTrack)
              ? initialTrack
              : initialTrack.split(',')).map(str => parseFloat(str));
          this.onChange(this.initialFilter);
        }
      }, 0);
    });

    this.filterSubject.pipe(takeUntil(this.destroy)).subscribe(value => {
      history.replaceState('', '', location.pathname + '?track=' + value);
    });

    this.select.selectionChange.pipe(takeUntil(this.destroy)).subscribe(selectChange => {
      this.onChange(selectChange.value);
    });

  }

  onToggleFav(event) {
    this.dataService.toggleFavorite(event);
  }

  onChange(value) {
    if (value === 'reset') {
      // set by remove-filter Button
      value = [];
      //this.select.nativeElement.value = value;
    }
    this.trackQuery = { track: value };
    this.filterSubject.next(value);
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
