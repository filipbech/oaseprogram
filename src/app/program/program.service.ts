import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IProgramItem } from './program.model';
import { API_PREFIX } from '../core.module';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { get, set } from 'idb-keyval';

const CACHE_KEY = 'programdata';

@Injectable()
export class ProgramService {

  private programItemsSubject = new ReplaySubject<IProgramItem[]>(1);
  public programItems$ = this.programItemsSubject.asObservable();

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

