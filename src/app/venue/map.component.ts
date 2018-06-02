import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take, switchMap, combineLatest } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
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
          [style.left]="venue.position.left+'%'">{{venue.mapNumber}}</button>
      </ng-container>

      <div class="detail-popup" #details
        *ngIf="chosen"
        [style.top]="chosen.position.top+'%'"
        [style.left]="chosen.position.left+'%'"
        >
        {{chosen.name}}
      </div>
    </div>
    <button class="locate-me-btn" (click)="watchLocation()" *ngIf="showBtn">Aktiver kort</button>
  </div>
  `
})
export class MapComponent implements OnInit, OnDestroy {

  me: Partial<IPosition> = { inView: false };
  @ViewChild('container') container: ElementRef;

  chosen: IVenue;

  showBtn = false;

  watchId: number;

  mapSize = {
    width: 1158,
    height: 619
  };

  venues: Observable<IVenue[]> = this.dataService.venues$.pipe(map(venues => venues
      .filter(venue => !!venue.location)
  ));

  onPointClicked(point: IVenue) {
    this.chosen = point;
  }

  ngOnInit() {
    if ('permissions' in navigator) {
      navigator['permissions'].query({ 'name': 'geolocation' }).then(status => {
        if (status.state === 'granted') {
          this.watchLocation();
          return;
        } else if (status.state === 'denied') {
          return;
        }
        // if we reach this point, permission hasn't been asked yet - so show the ask-permission btn
        this.showBtn = true;
        return;
      });
    } else {
      // the permissions API is not supported, so keep local state on it.
      if (localStorage.getItem('location-permission-asked') !== 'yes') {
        this.showBtn = true;
      }
    }

    this.activatedRoute.queryParams.pipe(
      take(1),
      combineLatest(this.venues),
      map(([queryParams, venueList]) => venueList.find(venue => venue.id === +queryParams.venue))
    )
      .subscribe(point => {
        if (point) {
          this.onPointClicked(point);
        }
      });
  }

  watchLocation() {
    this.watchId = navigator.geolocation.watchPosition(this.locationUpdate);
    localStorage.setItem('location-permission-asked', 'yes');
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
    private positionService: PositionService,
    private activatedRoute: ActivatedRoute
  ) {
    this.locationUpdate = this.locationUpdate.bind(this);
  }
}
