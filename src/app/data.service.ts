import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map,  share } from 'rxjs/operators';
import { get, set } from 'idb-keyval';

import { IApiResult, IInfoCategory, ITrack, IVenue, IProcessedApiResult, IVenueAPIResponse, ISpeaker, IEvent } from './data.model';
import { PositionService } from './venue/position.service';
export * from './data.model';

const CACHE_KEY = 'data';

const ONE_DAY = 86400000; // 24 hours in ms

const APIURL = '/assets/api/data.json';
//const APIURL = 'https://oaseprogramdata.herokuapp.com/data.json';

export const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

@Injectable()
export class DataService {

  private dataSubject = new BehaviorSubject<IProcessedApiResult>({
    speakers: [],
    venues: [],
    tracks: [],
    events: [],
    infoCategories: []
  });

  public tracks$: Observable<ITrack[]> = this.dataSubject.pipe(map(result => result.tracks));
  public venues$: Observable<IVenue[]> = this.dataSubject.pipe(map(result => result.venues));
  public speakers$: Observable<ISpeaker[]> = this.dataSubject.pipe(map(result => result.speakers));
  public events$: Observable<IEvent[]> = this.dataSubject.pipe(map(result => result.events));
  public infoCategory$: Observable<IInfoCategory[]> = this.dataSubject.pipe(map(result => result.infoCategories));

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
      return event.speakers.indexOf(speakerId) > -1;
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
        const infoCategories = data.infoCategories
          .map(category => {
            return Object.assign(category, {
              content: data.infoContent.filter(content => content.category === category.id)
            });
          });

        const venues = data.venues
          .map(venue => {
            return Object.assign(venue, {
              position: venue.location ? this.positionService.calculatePctFromLatLng(venue.location.lat, venue.location.lng) : null,
              number: Math.floor(Math.random() * 100) /** TODO: Replace MOCK WHEN REAL DATA IS AVAILABLE */
            });
          });

        const events = data.events
          .sort((eventA, eventB) => eventA.date.start - eventB.date.start)
          .map(event => {
            const trackName = data.tracks
              .filter(track => event.tracks.indexOf(track.id) > -1)
              .map(track => track.name)
              .join(', ');

            const speakersDetails = data.speakers
              .filter(speaker => event.speakers.indexOf(speaker.id) > -1);

            const speakerName = speakersDetails
              .map(speaker => speaker.name)
              .join(', ');

            const venueName = data.venues
              .find(venue => venue.id === event.venue).name;

            const trackColor = data.tracks
              .find(track => track.id === event.tracks[0]).color;

            return Object.assign(event, {
              trackName,
              speakerName,
              venueName,
              trackColor,
              speakersDetails
            });
          });

        const processed: IProcessedApiResult = {
          infoCategories,
          venues,
          events,
          tracks: data.tracks,
          speakers: data.speakers
        };

        this.dataSubject.next(processed as IProcessedApiResult);
        set(CACHE_KEY, processed);
      });

    // Schedule data-update in 15 minutes
    setTimeout(this.updateData.bind(this), 15 * 60 * 1000);
  }

  constructor(
    private http: HttpClient,
    private positionService: PositionService
  ) {
    // Use local (idb) version if one exists
    get(CACHE_KEY).then((data: IProcessedApiResult) => {
      if (data) {
        this.dataSubject.next(data);
      }
    });

    // Look for program on the server
    this.updateData();
  }
}
