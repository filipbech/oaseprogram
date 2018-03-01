import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { VenueService } from './venue.service';
import { Observable } from 'rxjs/Observable';
import { IVenue } from '../program/program.model';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  template: `
  <div class="map-container">
    <div class="map">
      <div class="me" #me></div>

      <button
        class="point"
        *ngFor="let point of venues | async"
        (click)="onPointClicked(point)"
        [style.top]="point.pct.top+'%'"
        [style.left]="point.pct.left+'%'"></button>


    </div>
  </div>

    <button (click)="showMe()">where am i?</button>
  `
})
export class MapComponent implements OnInit {

  @ViewChild('me') me: ElementRef;

  mapBounds = {
    latitude: [-25.1, 61.2],
    longitude: [-125.2, 140.7]
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
    navigator.geolocation.watchPosition(({ timestamp, coords: { accuracy, latitude, longitude } }) => {
      const pos = this.calculatePctFromLatLng(latitude, longitude);

      this.me.nativeElement.style.display = 'block';
      this.me.nativeElement.style.top = pos.top + '%';
      this.me.nativeElement.style.left = pos.left + '%';
    });
  }

  constructor(
    private venueService: VenueService,
    private router: Router
  ) {}
}
