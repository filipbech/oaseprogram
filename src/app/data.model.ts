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
  desc: string;
  type: string;
  logo: string;
}

export interface IEvent {
  id: number;
  name: string;
  desc: string;
  date: IDateRange;
  languages: string[];
  translations: string; // is it really?
  livestream: boolean;
  track: number;
  trackName?: string;
  venue: number;
  speaker: number;
  image: string;
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
  info: string;
}
