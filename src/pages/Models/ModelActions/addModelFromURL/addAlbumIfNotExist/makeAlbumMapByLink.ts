import DbService, { AlbumByLinkResult } from "../../../../../services/Db";
import { ScrappedAlbum } from "../../../../../services/Scrapper/models";

export default async function makeAlbumMapByLink(
   dbService: DbService,
   modelId: string,
   albumLinks: string[],
) {
   let dbAlbumMap: Map<string, AlbumByLinkResult> = new Map();
   let albums = await dbService.getAlbumsByLinks(modelId, albumLinks);
   for (let album of albums) {
      dbAlbumMap.set(album.originalUrl, album);
   }

   function isAlbumSaturated(scrappedAlbum: ScrappedAlbum) {
      if (scrappedAlbum.images.length === 0) {
         return true;
      }

      return dbAlbumMap.get(scrappedAlbum.link)?.imageCount === scrappedAlbum.images.length;
   }

   //local
   function getAlbumId(link: string) {
      return dbAlbumMap.get(link)?._id;
   }

   return { isAlbumSaturated, getAlbumId };
}
