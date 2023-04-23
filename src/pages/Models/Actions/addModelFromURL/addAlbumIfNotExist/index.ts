import config from "../../../../../config";
import DbService from "../../../../../services/Db";
import QueueService from "../../../../../services/Queue";
import ScrapperService from "../../../../../services/Scrapper";
import { Model } from "../../../../../services/Db/models/model";
import { AlbumSuggestion, ScrappedAlbum } from "../../../../../services/Scrapper/models";

import mergeScrappedAlbum from "../../../../../services/Scrapper/utils/mergeScrappedAlbum";
import createAlbumIfNotExist from "./createAlbumIfNotExist";
import saveNewImages from "./saveNewImages";

function isInvalidTitle(title?: string) {
   return !title || title.length === 0 || title.length > 75
}

export default async function addAlbumIfNotExist(
   model: Model,
   albumSuggestion: AlbumSuggestion,
   isAlbumSaturated: (album: ScrappedAlbum) => boolean,
   getAlbumId: (link: string) => string | undefined,
   ensureSiteAlias: (siteName: string) => Promise<string>,
) {
   const dbService = new DbService(config.dbAPIUrl)
   const scrapperService = new ScrapperService(config.scrapperAPIUrl)
   const queueService = new QueueService(config.queueAPIUrl)

   let scrappedAlbum = await scrapperService.getAlbum(albumSuggestion.link);
   scrappedAlbum = mergeScrappedAlbum(albumSuggestion, scrappedAlbum);

   if (isInvalidTitle(scrappedAlbum.title)) {
      scrappedAlbum.title = prompt('enter the name of the album', scrappedAlbum.title) ?? "new album"
   }

   //empty albums are possible
   if (scrappedAlbum.images.length === 0) {
      console.log("album is empty");
      return;
   }

   //if not exist create the album and add it to albumMap
   if (isAlbumSaturated(scrappedAlbum)) {
      console.log("album already exist");
      return;
   }

   //if not present add the site, and to siteMap
   let siteId = await ensureSiteAlias(scrappedAlbum.source);

   //check if the album already exist in db, if exist, ignore
   let album = await createAlbumIfNotExist(dbService, scrappedAlbum, getAlbumId, model._id, siteId);

   //save those images to db (images and albums) and add to queue
   return await saveNewImages(
      dbService,
      queueService,
      model,
      album,
      scrappedAlbum.images,
   );

}
