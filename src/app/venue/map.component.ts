import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IVenue, IPosition } from '../data.model';
import { DataService } from '../data.service';
import { PositionService } from './position.service';

@Component({
  selector: 'app-map',
  template: `
  <div class="map-container" #container>
    <div class="map">
      <div class="me"
          *ngIf="me.inView"
          [style.top]="me.top+'%'"
          [style.left]="me.left+'%'">
        <span class="me-point">
          <span class="pulse"></span>
        </span>
      </div>

      <ng-container *ngFor="let venue of venues | async">
        <button
          *ngIf="venue.position.inView"
          class="point"
          (click)="onPointClicked(venue)"
          [style.top]="venue.position.top+'%'"
          [style.left]="venue.position.left+'%'">{{venue.number}}</button>
      </ng-container>

      <div class="detail-popup" #details
        *ngIf="chosen"
        [style.top]="chosen.position.top+'%'"
        [style.left]="chosen.position.left+'%'"
        >
        {{chosen.name}}
      </div>
    </div>
    <button class="locate-me-btn" (click)="watchLocation()" *ngIf="showBtn">Activate map</button>
  </div>
  `
})
export class MapComponent implements OnInit, OnDestroy {

  me: Partial<IPosition> = { inView: false };
  @ViewChild('container') container: ElementRef;

  chosen: IVenue;

  showBtn = true;

  watchId: number;

  mapSize = {
    width: 1158,
    height: 619
  };

  venues: Observable<IVenue[]>;

  onPointClicked(point: IVenue) {
    this.chosen = point;
  }

  ngOnInit() {
    if ('permissions' in navigator) {
      navigator['permissions'].query({ 'name': 'geolocation' }).then(status => {
        if (status.state === 'granted') {
          this.showBtn = false;
          this.watchLocation();
        }
        if (status.state === 'denied') {
          this.showBtn = false;
        }
      });
    }

    this.venues = this.dataService.venues$.pipe(map(venues => {
      return venues
        .filter(venue => !!venue.location);
    }));
  }

  watchLocation() {
    this.watchId = navigator.geolocation.watchPosition(this.locationUpdate);
  }

  locationUpdate({ timestamp, coords: { accuracy, latitude, longitude } }) {
    this.me = this.positionService.calculatePctFromLatLng(latitude, longitude);

    if (this.showBtn) {
      const pixelsFromLeft = (this.mapSize.width * this.me.left / 100) - (this.container.nativeElement.getBoundingClientRect().width / 2);
      this.container.nativeElement.scrollTo(pixelsFromLeft, 0);
      this.showBtn = false;
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  constructor(
    private router: Router,
    private dataService: DataService,
    private positionService: PositionService
  ) {
    this.locationUpdate = this.locationUpdate.bind(this);
  }
}
