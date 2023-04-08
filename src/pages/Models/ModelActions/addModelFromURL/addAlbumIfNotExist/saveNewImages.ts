import DbService from "../../../../../services/Db";
import Album from "../../../../../services/Db/models/album";
import { Model } from "../../../../../services/Db/models/model";
import QueueService, { QueueItem } from "../../../../../services/Queue";
import { ScrappedImage } from "../../../../../services/Scrapper/models";
import { getTitleFromURL } from "../../../../../utils/urls";

export default async function saveNewImages(
   dbService: DbService,
   queueService: QueueService,
   model: Model,
   album: Album,
   scrappedImages: ScrappedImage[],
) {

   let queueItems: QueueItem[] = [];
   let imageUrls: string[] = [];
   for (let image of scrappedImages) {
      let queueItem = makeQueueItem(model, album, image);
      imageUrls.push(queueItem.path);
      queueItems.push(queueItem);
   }

   let imageIds = await dbService.addImages(imageUrls, model._id, album.siteId);

   let success = await queueService.addQueueItems(queueItems);
   await dbService.addImagesToAlbum(album._id, imageIds);
   return { totalImages: scrappedImages.length, adding: imageIds.length, success };
}

export function makeQueueItem(model: Model, album: Album, scrappedImage: ScrappedImage): QueueItem {
   let modelTitle = model.name.length === 0 ? "a model" : model.name;
   let albumTitle = album.name.length === 0 ? "an album" : album.name;
   let title = !scrappedImage.title?.length
      ? getTitleFromURL(scrappedImage.url)
      : scrappedImage.title;

   return {
      path: `${modelTitle}/${albumTitle}/${title}`,
      url: scrappedImage.url,
   };
}
