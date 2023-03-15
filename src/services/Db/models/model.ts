interface measurements {
   bust?: number;
   waist?: number;
   hip?: number;
   height?: number;
}
interface featuringImage {
   imageId: string;
   imageUrl: string;
}

export interface siteAlias {
   siteId: string;
   siteName: string;
   featuringImage?: featuringImage;
   alias: string;
   sources: string[];
}

export interface Model {
   _id: string;
   name: string;
   featuringImages?: featuringImage[];
   bio?: string;
   measurements?: measurements;
   dob?: Date;
   ethnicity?: string;
   eyeColor?: string;
   skinColor?: string;
   hairColor?: string;
   siteAlias: siteAlias[];
}
