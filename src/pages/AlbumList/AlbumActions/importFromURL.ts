import config from "../../../config";
import addAlbumIfNotExist from "../../Models/Actions/addModelFromURL/addAlbumIfNotExist";
import makeAlbumMapByLink from "../../Models/Actions/addModelFromURL/addAlbumIfNotExist/makeAlbumMapByLink";
import makeEnsureSiteAlias from "../../Models/Actions/addModelFromURL/makeEnsureSiteAlias";
import DbService from "../../../services/Db";
import { Model } from "../../../services/Db/models/model";
import { AlbumSuggestion, ScrappedModel } from "../../../services/Scrapper/models";

export default async function importFromURL(model : Model, url : string) {
    const dbService = new DbService(config.dbAPIUrl)
    let albumSuggestion : AlbumSuggestion = {
        title : "",
        link : url
    }

    let { isAlbumSaturated, getAlbumId } = await makeAlbumMapByLink(dbService, model._id, [url])
    const ensureSiteAlias = makeEnsureSiteAlias(dbService, model, {} as ScrappedModel)
    const {
        totalImages,
        adding,
        success
    } =
    await addAlbumIfNotExist(model, albumSuggestion, isAlbumSaturated, getAlbumId, ensureSiteAlias) || {}

    alert(`totalImages : ${totalImages}, adding : ${adding}, success : ${success}`);
}