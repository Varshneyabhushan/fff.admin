import { useCallback, useEffect, useMemo, useState } from "react";
import config from "../../config";
import DbService from "../../services/Db";
import { Model } from "../../services/Db/models/model";
import Resource from "../../utils/resource/Resource";
import toResource from "../../utils/resource/toResource";

const dbService = new DbService(config.dbAPIUrl)

type useModelsResult = [Resource<Model[]> | undefined, (page: number) => void]

export default function useModels(limit: number): useModelsResult {

    const [modelsResource, setModelsResource] = useState<Resource<Model[]>>()

    const setPage = useCallback((page: number) => {
        let skip = (page - 1) * limit
        setModelsResource(toResource(dbService.getModels(skip, limit)))
    },
        [setModelsResource, limit])

    useEffect(() => setPage(1), [setPage])

    return [modelsResource, setPage]
}