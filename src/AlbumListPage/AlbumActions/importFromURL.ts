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

enum albumCreationErrors {
    emptyAlbum = "album is empty",
    albumFull = "album is full"
}
export default async function importFromURL(model : Model, url : string) {
    const dbService = new DbService(config.dbAPIUrl)
    const scrapperService = new ScrapperService(config.scrapperAPIUrl)

    let scrappedAlbum = await scrapperService.getAlbum(url)

    if(scrappedAlbum.images.length === 0) {
        return Promise.reject(albumCreationErrors.emptyAlbum);
    }

    let albumSuggestion : AlbumSuggestion = {
        title : prompt('enter the name of the album', scrappedAlbum.title) ?? "new album",
        link : url
    }

    let { isAlbumSaturated, getAlbumId } = await makeAlbumMapByLink(dbService, model._id, [url])
    if(isAlbumSaturated(scrappedAlbum)) {
        return Promise.reject(albumCreationErrors.albumFull)
    }

    const ensureSiteAlias = makeEnsureSiteAlias(dbService, model, {} as ScrappedModel)
    await addAlbumIfNotExist(model, albumSuggestion, isAlbumSaturated, getAlbumId, ensureSiteAlias)
}