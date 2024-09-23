// types.ts
export interface User {
  _id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  uploads?: Release[];
  favorites?: Release[];
}

export interface Review {
  _id: string;
  text: string;
  stars: number;
  favouriteTrack: string;
  user: User;
}

export interface Release {
  _id: string;
  title: string;
  year: number;
  genre: string;
  releaseType: string;
  image?: string;
  user: User;
  artist: string | Artist;
  reviews: Review | Review[] | null;
  trackList: string[];
}


export interface Artist {
  _id: string;
  name: string;
  genre: string;
  country: string;
  formedYear: number;
  biography: string;
  image: string;
  user: User;
  releases: Release[];
}

