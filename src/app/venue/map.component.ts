import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { IVenue, IPosition } from '../data.model';
import { DataService } from '../data.service';

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
    alert(point.name);
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
        .filter(venue => !!venue.location)
        .map(venue => {
          return Object.assign({}, venue, {
            position: {
              ...this.calculatePctFromLatLng(venue.location.lat, venue.location.lng)
            }
          });
        });
    }));
  }

  calculatePctFromLatLng(lat, lng) {
    let top = 100 * ((lat - this.mapBounds.latitude[0]) / (this.mapBounds.latitude[1] - this.mapBounds.latitude[0]));
    let left = 100 * ((lng - this.mapBounds.longitude[0]) / (this.mapBounds.longitude[1] - this.mapBounds.longitude[0]));
    let inView = top > 0 && top < 100 && left > 0 && left < 100;

    // TODO: Remove fake
    /*FAKE START*/
    inView = true;
    if (top < 0) {
      top = 100 + (top % 100);
    }
    if (top > 100) {
      top = 100 - (top % 100);
    }

    if (left < 0) {
      left = 100 + (left % 100);
    }
    if (left > 100) {
      left = 100 - (left % 100);
    }
    /** FAKE END */

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
    private router: Router,
    private dataService: DataService
  ) {
    this.locationUpdate = this.locationUpdate.bind(this);
  }
}
