export default interface Album {
   _id: string;
   name: string;
   originalUrl?: string;
   siteId: string;
   modelIds: string[];
   imageIds?: string[];
   featuringImages?: string[];
   createdAt?: Date;
   lastModifiedAt?: Date;
}

