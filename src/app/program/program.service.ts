import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProgramItem } from './program.model';
import { API_PREFIX } from '../core.module';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { get, set } from 'idb-keyval';

import { combineLatest } from 'rxjs/operators/combineLatest';
import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs/Observable';

const CACHE_KEY = 'programdata';

@Injectable()
export class ProgramService {

  private programItemsSubject = new ReplaySubject<IProgramItem[]>(1);
  public programItems$ = this.programItemsSubject.asObservable();

  private filterSubject = new BehaviorSubject<{ [key: string]: any }>({});
  public filteredProgramItems$ = this.programItems$.pipe(
    combineLatest(this.filterSubject),
    map(value => {
      const items = value[0];
      const filterSettings = value[1];

      return items.filter(item => {
        for (const setting of Object.keys(filterSettings)) {
          if ((!Array.isArray(item[setting])) && item[setting] !== filterSettings[setting]) {
            return false;
          }
          if ((Array.isArray(item[setting])) && item[setting].indexOf(filterSettings[setting]) === -1 ) {
            return false;
          }
        }
        return true;
      });
    })
  );

  public setFilter(settings) {
    this.filterSubject.next(settings);
  }

  public getProgramItem(eventId: number): Observable<IProgramItem> {
    return this.programItems$.pipe(
      map(value => {
        return value.find(item => item.id === eventId);
      }));
  }

  public updateProgram() {
    this.http.get<IProgramItem[]>(API_PREFIX + '/api/program.json')
      .subscribe(data => {
        this.programItemsSubject.next(data);
        set(CACHE_KEY, data);
      });

    // Schedule program-update in 15 minutes
    setTimeout(this.updateProgram.bind(this), 15 * 60 * 1000);
  }

  constructor(private http: HttpClient) {
    // Use local (idb) version if one exists
    get(CACHE_KEY).then((data: IProgramItem[]) => {
      if (data) {
        this.programItemsSubject.next(data);
      }
    });

    // Look for program on the server
    this.updateProgram();
  }
}

