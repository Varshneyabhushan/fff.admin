import DbService from "../../../../services/Db";
import { Model } from "../../../../services/Db/models/model";
import { ScrappedModel } from "../../../../services/Scrapper/models";

function getDbModelFromModelInfo(scrappedModel: ScrappedModel): Model {
   let { title: name, bio, ethnicity, skinColor, eyeColor, hairColor } = scrappedModel;
   return {
      _id: "",
      name,
      bio,
      ethnicity,
      skinColor,
      eyeColor,
      hairColor,
      siteAlias: [],
   };
}

export default async function ensureModelInDb(dbService: DbService, scrappedModel: ScrappedModel) {
   //check, if model exist in database
   let existingModel = await dbService.getModelByLink(scrappedModel.link);
   if (existingModel !== undefined) {
      return existingModel;
   }

   let newModel = getDbModelFromModelInfo(scrappedModel);
   let modelId = await dbService.addModel(newModel);
   newModel._id = modelId;
   return newModel;
}
