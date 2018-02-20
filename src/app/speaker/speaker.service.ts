import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ISpeaker } from './speaker.model';
import { API_PREFIX } from '../core.module';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { map } from 'rxjs/operators/map';

import { get, set } from 'idb-keyval';
import { Observable } from 'rxjs/Observable';

const CACHE_KEY = 'speakerdata';

@Injectable()
export class SpeakerService {

  private speakersSubject = new ReplaySubject<ISpeaker[]>(1);
  public speakers$ = this.speakersSubject.asObservable();

  public getSpeaker(id: number): Observable<ISpeaker> {
    return this.speakers$.pipe(map(data => {
      return data.find(speaker => speaker.id === id);
    }));
  }

  public updateSpeakers() {
    this.http.get<ISpeaker[]>(API_PREFIX + '/api/speakers.json')
      .subscribe(data => {
        this.speakersSubject.next(data);
        set(CACHE_KEY, data);
      });

    // Schedule speaker-update in 15 minutes
    setTimeout(this.updateSpeakers.bind(this), 15 * 60 * 1000);
  }

  constructor(private http: HttpClient) {
    // Use local (idb) version if one exists
    get(CACHE_KEY).then((data: ISpeaker[]) => {
      if (data) {
        this.speakersSubject.next(data);
      }
    });

    // Look for speakers on the server
    this.updateSpeakers();
  }
}

