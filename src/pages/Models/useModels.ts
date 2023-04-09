import { useCallback, useState } from "react";
import config from "../../config";
import DbService from "../../services/Db";
import { Model } from "../../services/Db/models/model";
import Resource from "../../utils/resource/Resource";
import toResource from "../../utils/resource/toResource";

const dbService = new DbService(config.dbAPIUrl)

export default function useModels(limit : number) : [Resource<Model[]>, (page : number) => void] {
    const [modelsResource, setModelsResource] = useState(toResource(dbService.getModels(0, limit)))

    const loadPage = useCallback((page : number) => {
        let skip = (page - 1)* limit
        let newResource = toResource(dbService.getModels(skip, limit))
        setModelsResource(newResource)
    },
    [limit])

    return [modelsResource, loadPage]
}