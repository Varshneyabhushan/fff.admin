import config from "../../config";
import addAlbumIfNotExist from "../../ModelsListPage/ModelActions/addModelFromURL/addAlbumIfNotExist";
import createAlbumIfNotExist from "../../ModelsListPage/ModelActions/addModelFromURL/addAlbumIfNotExist/createAlbumIfNotExist";
import makeAlbumMapByLink from "../../ModelsListPage/ModelActions/addModelFromURL/addAlbumIfNotExist/makeAlbumMapByLink";
import saveNewImages from "../../ModelsListPage/ModelActions/addModelFromURL/addAlbumIfNotExist/saveNewImages";
import makeEnsureSiteAlias from "../../ModelsListPage/ModelActions/addModelFromURL/makeEnsureSiteAlias";
import DbService from "../../services/Db";
import Album from "../../services/Db/models/album";
import { Model } from "../../services/Db/models/model";
import ScrapperService from "../../services/Scrapper";
import { AlbumSuggestion, ScrappedModel } from "../../services/Scrapper/models";

export default async function importFromURL(model : Model, url : string) {
    const dbService = new DbService(config.dbAPIUrl)
    let albumSuggestion : AlbumSuggestion = {
        title : "",
        link : url
    }

    let { isAlbumSaturated, getAlbumId } = await makeAlbumMapByLink(dbService, model._id, [url])
    const ensureSiteAlias = makeEnsureSiteAlias(dbService, model, {} as ScrappedModel)
    await addAlbumIfNotExist(model, albumSuggestion, isAlbumSaturated, getAlbumId, ensureSiteAlias)
}