export interface ModelSuggestion {
   id?: string; // we get ids in some cases
   thumb?: string;
   title: string;
   link: string;
   site?: string; //siteTag from which suggestion is brought
   source?: string; //origin siteName
}

export interface Measurements {
   bust: number | string;
   waist: number | string;
   hips: number | string;
}

interface AliasMap {
   [key: string]: string;
}

export interface ScrappedModel {
   id?: string; //we get ids in some cases
   title: string;
   thumb?: string;
   albums: AlbumSuggestion[]; //list of albums model is in
   bio?: string;
   source?: string;
   ethnicity?: string;
   skinColor?: string;
   eyeColor?: string;
   hairColor?: string;
   link: string; //link/homepage of the model : unique about model
   aliases?: AliasMap;
   measurements?: Measurements | string;
}

export interface AlbumSuggestion {
   id?: string; // we get albumIds in some cases
   title: string;
   thumb?: string;
   thumbSet?: any;
   link: string; // link/homepage for the album
   date?: Date; // date of the album
}

export interface ScrappedAlbum {
   id?: string;
   title: string;
   images: ScrappedImage[];
   thumb?: string;
   thumbSet?: any;
   link: string;
   source: string; //site from which this album is scrapped
   date?: Date;
}

export interface ScrappedImage {
   id?: string; //id of the url/image
   title?: string;
   thumb?: string;
   url: string;
}
