import { ScrappedAlbum, AlbumSuggestion } from "../models";

// merges albumInfo with albumSuggestion
export default function mergeScrappedAlbum(
   albumSuggestion: AlbumSuggestion,
   scrappedAlbum: ScrappedAlbum,
): ScrappedAlbum {
   // title doesn't exist or is empty string
   if (albumSuggestion.title.length !== 0) {
      scrappedAlbum.title = albumSuggestion.title;
   }

   if (!scrappedAlbum.id?.length) {
      scrappedAlbum.id = albumSuggestion.id;
   }

   if (!scrappedAlbum.date || scrappedAlbum.date.toString() === new Date("dfd").toString()) {
      scrappedAlbum.date = albumSuggestion.date;
   }

   return scrappedAlbum;
}
