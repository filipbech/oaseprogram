import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { VenueService } from './venue.service';
import { Observable } from 'rxjs/Observable';
import { IVenue } from '../program/program.model';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  template: `
  <div class="map-container" #container>
    <div class="map">
      <div class="me" #me>
        <span class="point">
          <span class="pulse"></span>
        </span>
      </div>

      <button
        class="point"
        *ngFor="let point of venues | async"
        (click)="onPointClicked(point)"
        [style.top]="point.pct.top+'%'"
        [style.left]="point.pct.left+'%'"></button>

    </div>
  </div>

    <button (click)="showMe()" *ngIf="showBtn">where am i?</button>
  `
})
export class MapComponent implements OnInit, OnDestroy {

  @ViewChild('me') me: ElementRef;
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
    this.venues = this.venueService.venues$.pipe(map(venues => {
      return venues.map(venue => {
        return Object.assign({}, venue, {
          pct: {
            ...this.calculatePctFromLatLng(venue.location.lat, venue.location.lng)
          }
        });
      });
    }));
  }

  calculatePctFromLatLng(lat, lng) {
    const top = 100 * ((lat - this.mapBounds.latitude[0]) / (this.mapBounds.latitude[1] - this.mapBounds.latitude[0]));
    const left = 100 * ((lng - this.mapBounds.longitude[0]) / (this.mapBounds.longitude[1] - this.mapBounds.longitude[0]));
    return { top, left };
  }

  showMe() {
    this.watchId = navigator.geolocation.watchPosition(({ timestamp, coords: { accuracy, latitude, longitude } }) => {
      const pos = this.calculatePctFromLatLng(latitude, longitude);

      if (this.showBtn) {
        const pixelsFromLeft = (this.mapSize.width * pos.left / 100) - (this.container.nativeElement.getBoundingClientRect().width / 2);
        this.container.nativeElement.scrollTo(pixelsFromLeft, 0);
        this.showBtn = false;
      }

      this.me.nativeElement.style.display = 'block';
      this.me.nativeElement.style.top = pos.top + '%';
      this.me.nativeElement.style.left = pos.left + '%';
    });
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  constructor(
    private venueService: VenueService,
    private router: Router
  ) {}
}
