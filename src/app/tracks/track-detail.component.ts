import { Component, OnInit, OnDestroy } from '@angular/core';
import { ITrack } from '../data.model';
import { Subject, Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-track-detail',
  template: `
    <div *ngIf="( track | async ) as myTrack">
      <h1>{{myTrack.name}}</h1>
      <div [innerHTML]="myTrack.desc"></div>
      <img [src]="myTrack.imgUrl" [alt]="myTrack.name"/>
    </div>
  `
})
export class TrackDetailComponent implements OnDestroy {
  destroy = new Subject();
  track: Observable<ITrack> = this.activatedRoute.params.pipe(
    takeUntil(this.destroy),
    switchMap(params => this.dataService.getTrack(parseFloat(params['id']))),
  );

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) { }
}
