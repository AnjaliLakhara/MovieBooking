export type MovieLanguage = 'Hindi' | 'English' | 'Korean' | 'Japanese' | 'Telegu';
export type MovieFormat = '2D' | '3D' | '4DX' | 'IMAX' | 'ScreenX';
// export type MovieGenre = 'Action' | 'Comedy' | 'Drama' | 'Sci-Fi' | 'Romance' | 'Thriller' | 'Horror';
export type Certification = 'U' | 'UA7+' | 'UA13+' | 'UA16+' | 'A';

export interface UserProfile {
uid: string;
  displayName: string;
  email: string;
  role: 'user' | 'admin'; 
  createdAt: any;
  subProfiles?: string[];
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  languages: MovieLanguage[]; 
  formats: MovieFormat[];
  genres: string[]; 
  certification: Certification;
  durationMinutes: number;
  imdbRating?: number;
  featuredLists?: string[];
}

  export interface Hotlist {
  id: string;
  name: string;       
  description?: string;
  icon?: string; 
  movieIds: string[];       
  createdAt: any;
  updatedAt: any;
  isDefaultList: boolean;
}

export interface Genre {
  id?: string;
  name: string;
}