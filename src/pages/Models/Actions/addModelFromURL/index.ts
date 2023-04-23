import ScrapperService from "../../../../services/Scrapper";

import DbService from "../../../../services/Db";
import ensureModelInDb from "./ensureModelInDb";

import makeEnsureSiteAlias from "./makeEnsureSiteAlias";
import makeAlbumMapByLink from "./addAlbumIfNotExist/makeAlbumMapByLink";
import addAlbumIfNotExist from "./addAlbumIfNotExist";
import config from "../../../../config";

export default async function addModelFromURL(url: string) {

   const dbService = new DbService(config.dbAPIUrl)
   const scrapperService = new ScrapperService(config.scrapperAPIUrl)

   /**
    * -> getting modelInfo from user
    * get modelLink from prompt
    * get modelInfo from scrapper using modelLink
    */
   console.log("getting modelInfo...");
   let scrappedModel = await scrapperService.getModel(url);

   /**
    * -> getting model from db
    * search model by modelLink in db
    * 1. if present, get that model
    * 2. if doesn't present, insert new model and get it as a model
    * 3. make siteMaps that helps to add newsite: map (siteName -> siteId)
    */
   let model = await ensureModelInDb(dbService, scrappedModel);
   let ensureSiteAlias = await makeEnsureSiteAlias(dbService, model, scrappedModel);

   /**
    * -> making albumMap
    * 1. for each of the album, get it's link (should be present in albumSuggestion)
    *    so, verification happens without an extra call
    *
    * 2. get all the albums using their albumLinks
    * 3. make the albumMap by link, for easy look up : map (link -> #images)
    */
   let albumLinks = scrappedModel.albums.map((albumSuggestion) => albumSuggestion.link);
   let { isAlbumSaturated, getAlbumId } = await makeAlbumMapByLink(
      dbService,
      model._id,
      albumLinks,
   );

   for (let albumSuggestion of scrappedModel.albums) {
      let {
         totalImages,
         adding,
         success
      } = (await addAlbumIfNotExist(
         model,
         albumSuggestion,
         isAlbumSaturated,
         getAlbumId,
         ensureSiteAlias,
      )) || { totalImages: 0, adding: 0, success: 0 }

      console.log(`totalImages : ${totalImages}, adding : ${adding}, success : ${success}`);
   }
}
