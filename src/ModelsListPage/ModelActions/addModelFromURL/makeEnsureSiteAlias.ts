
import DbService from "../../../services/Db";
import { Model, siteAlias } from "../../../services/Db/models/model";
import { Site } from "../../../services/Db/models/site";
import { ScrappedModel } from "../../../services/Scrapper/models";

//makes sure that, siteAlias provided are present in model
export default function makeEnsureSiteAlias(
   dbService: DbService,
   model: Model,
   scrappedModel: ScrappedModel,
) {
   let siteMapByNames: Map<string, string> = new Map();
   for (let siteAlias of model.siteAlias) {
      siteMapByNames.set(siteAlias.siteName ?? "", siteAlias.siteId);
   }

   let { aliases = {}, link } = scrappedModel;

   return async function ensureSiteAlias(siteName: string) {
      if (siteMapByNames.has(siteName)) {
         return siteMapByNames.get(siteName) as string;
      }

      let site = await addSite(dbService, siteName);
      siteMapByNames.set(siteName, site._id as string);

      if((link?.length ?? 0) === 0) {
         let linkPrompt = prompt("enter source of model")
         if(!linkPrompt) {
            return Promise.reject('link should be not null')
         }

         link = linkPrompt
      }

      //add siteAlias to model
      let newAlias = {
         siteId: site._id,
         alias: aliases[site._id ?? ""] ?? model.name,
         siteName,
         sources: [link],
      } as siteAlias;

      model.siteAlias.push(newAlias);
      const { _id, siteAlias } = model;
      let updatingSiteAlias = siteAlias.map(({ siteName, ...rest }) => rest);
      await dbService.updateModel({ _id, siteAlias: updatingSiteAlias as siteAlias[] });

      return site._id as string;
   };
}

/**
 * check if site is present in the database
 *    if yes, get the site and return
 *    get siteName from prompt
 *    create the site and add it to model
 */
async function addSite(dbService: DbService, siteName: string): Promise<Site> {
   let [newSite] = await dbService.getSitesByNames([siteName]);
   if (!newSite) {
      let siteUrl = prompt("add url for the siteName : " + siteName)
      siteUrl = (siteUrl as string).trim();
      let addingSite = { siteName, siteUrl };
      let siteId = await dbService.addSite(addingSite);
      newSite = { _id: siteId, ...addingSite };
   }

   return newSite;
}
