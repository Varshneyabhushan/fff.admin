export default interface Album {
   _id: string;
   name: string;
   originalUrl?: string;
   siteId: string;
   modelIds: string[];
   images?: AlbumImage[];
   featuringImages?: AlbumImage[];
}

export interface AlbumImage {
   id: string;
   url: string;
}
