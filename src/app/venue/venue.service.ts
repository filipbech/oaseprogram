import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '../core.module';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators/map';

import { get, set } from 'idb-keyval';
import { Observable } from 'rxjs/Observable';
import { IVenue } from '../program/program.model';

const CACHE_KEY = 'venuedata';

@Injectable()
export class VenueService {

  private venuesSubject = new ReplaySubject<IVenue[]>(1);
  public venues$ = this.venuesSubject.asObservable();

  public updateVenues() {
    this.http.get<IVenue[]>(API_PREFIX + '/api/venues.json')
      .subscribe(data => {
        this.venuesSubject.next(data);
        set(CACHE_KEY, data);
      });

    // Schedule venue-update in 15 minutes
    setTimeout(this.updateVenues.bind(this), 15 * 60 * 1000);
  }

  constructor(private http: HttpClient) {
    // Use local (idb) version if one exists
    get(CACHE_KEY).then((data: IVenue[]) => {
      if (data) {
        this.venuesSubject.next(data);
      }
    });

    // Look for venues on the server
    this.updateVenues();
  }
}

