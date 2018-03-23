export interface IProgramItem {
  date: {
    from: Date;
    to: Date;
  };
  id: number;
  title: string;
  description: string;
  image: string;

  venueIds: number[];
  categoryIds: number[];
  speakerIds: number[];

  favorite: boolean;
}


export interface ICategory {
  id: number;
  title: string;
  image: string;
  color: string;
}
export interface IVenue {
  id: number;
  title: string;
  location: {
    lat: string;
    lng: string;
  };
  position?: IPosition ;
}

export interface IPosition {
  inView: boolean;
  top: number;
  left: number;
}
