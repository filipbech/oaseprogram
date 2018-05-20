import { Component, OnDestroy, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataService, IEvent, ITrack, dayNames, ITrackCategory } from '../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable,  Subject,  BehaviorSubject } from 'rxjs';
import { takeUntil,  switchMap,  tap, combineLatest, map, take, filter } from 'rxjs/operators';
import { arrow } from '../icons/arrow';

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
      <optgroup *ngFor="let trackCategory of tracks | async" [label]="trackCategory.type">
        <option *ngFor="let track of trackCategory.tracks" [value]="track.id">{{ track.name }}</option>
      <optgroup>
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
export class ProgramComponent implements OnDestroy, OnInit {

  @ViewChild('select') select: ElementRef;

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
      combineLatest(this.filterSubject.asObservable()),
      map(([events, selectedTrack]) => {
        return events.filter((event: IEvent) => selectedTrack ? event.tracks.indexOf(selectedTrack) > -1 : true);
      })
    );

  ngOnInit() {
    this.activatedRoute.queryParams.pipe(
      map(queryparams => queryparams.track),
      takeUntil(this.destroy),
      combineLatest(this.tracks)
    )
    .subscribe(([initialTrack, _unused]) => {
      this.onChange(initialTrack);
      setTimeout(_ => {
        if (initialTrack) {
          this.select.nativeElement.value = initialTrack;
        }
      }, 0);
    });
  }

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
