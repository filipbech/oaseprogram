import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { switchMap } from 'rxjs/operators/switchMap';
import { DataService, IVenue } from '../data.service';
import { takeUntil } from 'rxjs/operators/takeUntil';

@Component({
  selector: 'app-venue',
  template: `
  <div *ngIf="venue">
    <h3>{{ venue.name }}</h3>
    <p>hvad viser vi her? Måske program, men gir det mening med program for et venue??</p>
  </div>
  `
})
export class VenueComponent implements OnDestroy, OnInit {
  destroy = new Subject();

  venue: IVenue;

  ngOnInit() {
    this.activatedRoute.params.pipe(
      takeUntil(this.destroy),
      switchMap(params => this.dataService.getVenue(parseFloat(params['venueId'])))
    ).subscribe(venue => this.venue = venue);
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
  ) {}
}
