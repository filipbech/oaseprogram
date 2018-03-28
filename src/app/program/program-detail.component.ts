import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators/switchMap';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs/Subject';
import { IEvent } from '../data.model';
import { DataService } from '../data.service';


@Component({
  selector: 'app-program-detail',
  template: `
    <div *ngIf="event">
      <h3>{{ event.name }}</h3>
      <p>tid, sted, taler, spor</p>
      <a [routerLink]="['/venue', event.venue]">Se location</a>
      <a [routerLink]="['/program', 'speaker', event.speaker]">Se speaker</a>
    </div>
  `
})
export class ProgramDetailComponent implements OnInit, OnDestroy {
  event: IEvent;

  destroy = new Subject();

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getEvent(parseFloat(params['eventId'])))
    ).subscribe(event => this.event = event);
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
