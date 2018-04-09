import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators/map';
import { share } from 'rxjs/operators/share';
import { get, set } from 'idb-keyval';

import { IApiResult } from './data.model';
export * from './data.model';

const CACHE_KEY = 'data';

const ONE_DAY = 86400000; // 24 hours in ms

// const APIURL = '/assets/api/data.json';
const APIURL = 'https://oaseprogramdata.herokuapp.com/data.json';

@Injectable()
export class DataService {

  private dataSubject = new BehaviorSubject<IApiResult>({
    speakers: [],
    venues: [],
    tracks: [],
    events: [],
    info: ''
  });

  public tracks$ = this.dataSubject.pipe(map(result => result.tracks), /*share()*/);
  public venues$ = this.dataSubject.pipe(map(result => result.venues), /*share()*/);
  public speakers$ = this.dataSubject.pipe(map(result => result.speakers), /*share()*/);
  public events$ = this.dataSubject.pipe(
    map(result => result.events.sort((eventA, eventB) => eventA.date.start - eventB.date.start).map(event => {
      const eventTrack = this.dataSubject.getValue().tracks.find(track => track.id === event.track);
      const eventSpeaker = this.dataSubject.getValue().speakers.find(speaker => speaker.id === event.speaker);
      const eventVenue = this.dataSubject.getValue().venues.find(venue => venue.id === event.venue);
      return {
        ...event,
        trackName: eventTrack ? eventTrack.name : null,
        speakerName: eventSpeaker ? eventSpeaker.name : null,
        venueName: eventVenue ? eventVenue.name : null
      };
    })),
    /*share()*/
  );
  public info$ = this.dataSubject.pipe(map(result => result.info), /*share()*/);

  public getVenue(id: number) {
    return this.venues$.pipe(map(venues => venues.find(venue => venue.id === id)));
  }
  public getSpeaker(id: number) {
    return this.speakers$.pipe(map(speakers => speakers.find(speaker => speaker.id === id)));
  }

  public getEventsByDate(datestr: string) {
    const start = new Date(datestr).getTime();
    const end = start + ONE_DAY;
    return this.events$.pipe(map(events => events.filter(event => {
      return event.date.start > start && event.date.start < end;
    })));
  }

  public getEventsBySpeaker(speakerId: number) {
    return this.events$.pipe(map(events => events.filter(event => {
      return event.speaker === speakerId;
    })));
  }

  public toDateString(date: Date) {
    let month = '' + (date.getMonth() + 1);
    if (month.length === 1) { month = '0' + month; }
    let day = '' + (date.getDate());
    if (day.length === 1) { day = '0' + day; }
    return `${date.getFullYear()}-${month}-${day}`;
  }

  public getFirstLastEventStart() {
    return this.events$.pipe(map(events => {
      return {
        first: events.length && events[0].date.start,
        last: events.length && events[events.length - 1].date.start
      };
    }));
  }

  public nextPreviousDayLinkInfo(datestr: string) {
    const todayStart = new Date(datestr).getTime();
    return this.getFirstLastEventStart().pipe(
      map(eventBounds => {
        return {
          prev: eventBounds.first && eventBounds.first < todayStart ? this.toDateString(new Date(todayStart - ONE_DAY)) : null,
          next: eventBounds.last > todayStart + ONE_DAY ? this.toDateString(new Date(todayStart + ONE_DAY)) : null
        };
      }));
  }

  public getEvent(id: number) {
    return this.events$.pipe(map(events => events.find(event => event.id === id)));
  }

  public updateData() {
    this.http.get<IApiResult>(APIURL)
      .subscribe(data => {
        this.dataSubject.next(data);
        set(CACHE_KEY, data);
      });

    // Schedule data-update in 15 minutes
    setTimeout(this.updateData.bind(this), 15 * 60 * 1000);
  }

  constructor(private http: HttpClient) {
    // Use local (idb) version if one exists
    get(CACHE_KEY).then((data: IApiResult) => {
      if (data) {
        this.dataSubject.next(data);
      }
    });

    // Look for program on the server
    this.updateData();
  }
}
