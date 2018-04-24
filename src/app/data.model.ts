export interface ISpeaker {
  id: number;
  name: string;
  desc: string;
  imgUrl: string;
}

export interface IVenue {
  id: number;
  name: string;
  location: ICoordinateSet;
  type: string;
  number: number;
  position?: IPosition;
}

export interface IPosition {
  inView: boolean;
  top: number;
  left: number;
}

export interface ICoordinateSet {
  lat: string;
  lng: string;
}

export interface ITrack {
  id: number;
  name: string;
  desc: string; /* take this out? */
  type: string;
  logo: string;
  imgUrl: string;
}

export interface IEvent {
  id: number;
  name: string;
  desc: string;
  date: IDateRange;
  languages: string[];
  translations: string; // is it really?
  livestream: boolean;
  tracks: number[];
  trackName?: string;
  speakers: number[];
  speakerName?: string;
  venue: number;
  venueName?: string;
  imgUrl: string;
}

export interface IDateRange {
  start: number;
  end: number;
}

export interface IApiResult {
  speakers: ISpeaker[];
  venues: IVenue[];
  tracks: ITrack[];
  events: IEvent[];
  infoCategories: IInfoCategory[];
  infoContent: IInfoContent[];
}

export interface IInfoCategory {
  id: number;
  name: string;
  desc: string;
  content?: IInfoContent[];
}

export interface IInfoContent {
  id: number;
  header: string;
  content: string;
  category: number;
}
