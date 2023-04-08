import DbService from "../../../../../services/Db";
import Album from "../../../../../services/Db/models/album";
import { ScrappedAlbum } from "../../../../../services/Scrapper/models";

export default async function createAlbumIfNotExist(
   dbService: DbService,
   scrappedAlbum: ScrappedAlbum,
   getAlbumId: (link: string) => string | undefined,
   modelId: string,
   siteId: string,
): Promise<Album> {
   let albumId = getAlbumId(scrappedAlbum.link);
   if (albumId) {
      return dbService.getAlbumById(albumId);
   }

   //album doesn't exist in db
   let creatingAlbum: Omit<Album, "_id"> = {
      name: scrappedAlbum.title,
      modelIds: [modelId],
      siteId,
      originalUrl: scrappedAlbum.link,
   };

   albumId = await dbService.addAlbum(creatingAlbum);
   return { _id: albumId, ...creatingAlbum };
}
