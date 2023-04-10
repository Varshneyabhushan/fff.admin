import { useEffect, useState } from "react";
import Resource from "../../utils/resource/Resource";
import { Model } from "../../services/Db/models/model";
import toResource from "../../utils/resource/toResource";
import DbService from "../../services/Db";
import config from "../../config";

let dbService = new DbService(config.dbAPIUrl)

export default function useAlbumCount(model : Model | undefined) {
    const [countResource, setCountResource] = useState<Resource<number>>()
    useEffect(() => {
        if(!model) {
            return
        }

        setCountResource(toResource(dbService.getAlbumsCount(model._id)))
    },
        [model, setCountResource])

    return countResource
}