import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { VenueService } from './venue.service';
import { Observable } from 'rxjs/Observable';
import { IVenue, IPosition } from '../program/program.model';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  template: `
  <div class="map-container" #container>
    <div class="map">
      <div class="me"
          *ngIf="me.inView"
          [style.top]="me.top+'%'"
          [style.left]="me.left+'%'">
        >
        <span class="me-point">
          <span class="pulse"></span>
        </span>
      </div>

      <ng-container  *ngFor="let point of venues | async">
        <button
          *ngIf="point.position.inView"
          class="point"
          (click)="onPointClicked(point)"
          [style.top]="point.position.top+'%'"
          [style.left]="point.position.left+'%'"></button>
      </ng-container>
    </div>
    <button class="locate-me-btn" (click)="watchLocation()" *ngIf="showBtn">Activate map</button>
  </div>
  `
})
export class MapComponent implements OnInit, OnDestroy {

  me: Partial<IPosition> = { inView: false };
  @ViewChild('container') container: ElementRef;

  showBtn = true;

  watchId: number;

  mapSize = {
    width: 1158,
    height: 619
  };

  mapBounds = {
    latitude: [56.125205, 56.117716],
    longitude: [10.120664, 10.145729]
  };

  venues: Observable<IVenue[]>;

  onPointClicked(point: IVenue) {
    this.router.navigateByUrl('/venue/' + point.id);
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

    this.venues = this.venueService.venues$.pipe(map(venues => {
      return venues.map(venue => {
        return Object.assign({}, venue, {
          position: {
            ...this.calculatePctFromLatLng(venue.location.lat, venue.location.lng)
          }
        });
      });
    }));
  }

  calculatePctFromLatLng(lat, lng) {
    const top = 100 * ((lat - this.mapBounds.latitude[0]) / (this.mapBounds.latitude[1] - this.mapBounds.latitude[0]));
    const left = 100 * ((lng - this.mapBounds.longitude[0]) / (this.mapBounds.longitude[1] - this.mapBounds.longitude[0]));
    const inView = top > 0 && top < 100 && left > 0 && left < 100;
    return { top, left, inView };
  }

  watchLocation() {
    this.watchId = navigator.geolocation.watchPosition(this.locationUpdate);
  }

  locationUpdate({ timestamp, coords: { accuracy, latitude, longitude } }) {
    this.me = this.calculatePctFromLatLng(latitude, longitude);

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
    private venueService: VenueService,
    private router: Router
  ) {
    this.locationUpdate = this.locationUpdate.bind(this);
  }
}
