

import { Fragment, useState } from "react"
import config from "../config"
import DbService from "../services/Db"
import { Model } from "../services/Db/models/model"
import ErrorBoundary from "../utils/resource/ErrorBoundary"
import Resource from "../utils/resource/Resource"
import toResource from "../utils/resource/toResource"
import ModelPagination from "./Pagination"
import ModelList from "./ModelList"


const dbService = new DbService(config.dbAPIUrl)
const initialModelsResource = toResource(dbService.getModels(0, 10))
const modelsCountResource = toResource(dbService.getModelsCount())
export type ModelsResource = Resource<Model[]>

const ModelsPerPage = 20
export function ModelListPage() {

    const [resource, setResource] = useState<ModelsResource>(initialModelsResource)
    
    const totalModels = modelsCountResource.read()
    const totalPages = Math.ceil(totalModels / ModelsPerPage)

    function pageChange(newPageVal: number) {
        let skip = (newPageVal - 1) * ModelsPerPage
        let newResource = toResource(dbService.getModels(skip, ModelsPerPage))
        setTimeout(() => setResource(newResource), 0)
    }

    return (
        <Fragment>
            <ErrorBoundary fallback={"error while loading pagination"}>
                <ModelPagination pageChange={pageChange} totalPages={totalPages} totalModels={totalModels} />
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading models"}>
                <ModelList resource={resource} />
            </ErrorBoundary>
        </Fragment>
    )
}
