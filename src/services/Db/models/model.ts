export interface measurements {
   bust?: number;
   waist?: number;
   hip?: number;
   height?: number;
}

export interface siteAlias {
   siteId: string;
   siteName?: string;
   alias: string;
   sources: string[];
}

export interface Model {
   _id: string;
   name: string;
   featuringImages?: string[];
   bio?: string;
   measurements?: measurements;
   dob?: Date;
   ethnicity?: string;
   eyeColor?: string;
   skinColor?: string;
   hairColor?: string;
   siteAlias: siteAlias[];
}
