export default interface Album {
   _id: string;
   name: string;
   originalUrl?: string;
   siteId: string;
   modelIds: string[];
   images?: string[];
   featuringImages?: string[];
}

