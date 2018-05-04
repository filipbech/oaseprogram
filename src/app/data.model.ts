export interface ISpeakerAPIResponse {
  id: number;
  name: string;
  desc: string;
  imgUrl: string;
}
export interface ISpeaker extends ISpeakerAPIResponse {}

export interface IVenueAPIResponse {
  id: number;
  name: string;
  location: ICoordinateSet;
  type: string;
}

export interface IVenue extends IVenueAPIResponse {
  position: IPosition;
  number: number; /** THIS SHOULD BE PART OF RESPONSE */
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

export interface ITrackAPIResponse {
  id: number;
  name: string;
  desc: string; /* take this out? */
  type: string;
  color: string;
  imgUrl: string;
}
export interface ITrack extends ITrackAPIResponse { }

export interface IEventAPIResponse {
  id: number;
  name: string;
  desc: string;
  date: IDateRange;
  languages: string[]; /* take this out? */
  translations: string; /* take this out? */
  livestream: boolean; /* take this out? */
  tracks: number[];
  speakers: number[];
  venue: number;
  imgUrl: string;
}

export interface IEvent extends IEventAPIResponse {
  trackName: string;
  trackColor: string;
  speakerName: string;
  speakersDetails: ISpeaker[];
  venueName: string;
}

export interface IDateRange {
  start: number;
  end: number;
}

export interface IInfoCategoryAPIResponse {
  id: number;
  name: string;
  desc: string;
}
export interface IInfoCategory extends IInfoCategoryAPIResponse {
  content?: IInfoContent[];
}

export interface IInfoContentAPIResponse {
  id: number;
  header: string;
  content: string;
  category: number;
}
export interface IInfoContent extends IInfoContentAPIResponse {}


export interface IApiResult {
  speakers: ISpeakerAPIResponse[];
  venues: IVenueAPIResponse[];
  tracks: ITrackAPIResponse[];
  events: IEventAPIResponse[];
  infoCategories: IInfoCategoryAPIResponse[];
  infoContent: IInfoContentAPIResponse[];
}

export interface IProcessedApiResult {
  speakers: ISpeaker[];
  venues: IVenue[];
  tracks: ITrack[];
  events: IEvent[];
  infoCategories: IInfoCategory[];
}
