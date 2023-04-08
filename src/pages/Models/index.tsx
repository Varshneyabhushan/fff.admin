
import "./index.scss"

import { Fragment, Suspense, useState } from "react"
import { Link } from "react-router-dom";

import config from "../../config"
import DbService from "../../services/Db"
import { Model } from "../../services/Db/models/model"
import ErrorBoundary from "../../utils/resource/ErrorBoundary"
import Resource from "../../utils/resource/Resource"
import toResource from "../../utils/resource/toResource"
import Pagination from "../../Components/Pagination"
import ModelActions from "./Actions"
import getThumbnail from "../../utils/models/getThumbnail"

const dbService = new DbService(config.dbAPIUrl)
const ModelsPerPage = 20
const initialModelsResource = toResource(dbService.getModels(0, ModelsPerPage))
const modelsCountResource = toResource(dbService.getModelsCount())
export type ModelsResource = Resource<Model[]>

export function ModelListPage() {

    const [resource, setResource] = useState<ModelsResource>(initialModelsResource)

    const totalModels = modelsCountResource.read()
    const totalPages = Math.ceil(totalModels / ModelsPerPage)

    function pageChange(newPageVal: number) {
        let skip = (newPageVal - 1) * ModelsPerPage
        let newResource = toResource(dbService.getModels(skip, ModelsPerPage))
        setResource(newResource)
    }

    return (
        <Fragment>
            <ErrorBoundary fallback={"error while loading pagination"}>
                <ModelActions />
                <Pagination pageChange={pageChange} totalPages={totalPages} totalItems={totalModels} />
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading models"}>
                <Suspense fallback={"loading modelList"}>
                    <ModelList resource={resource} />
                </Suspense>
            </ErrorBoundary>
        </Fragment>
    )
}


function ModelList({ resource }: { resource: ModelsResource }) {
    return (
        <div className="modelList">
            {resource.read().map(model => <ModelContainer key={model._id} source={model} />)}
        </div>
    )
}


function ModelContainer({ source }: { source: Model }) {
    return (
        <Link
            className="modelContainer"
            to={`/models/${source._id}`}
            state={{
                model: source,
            }}
        >
            <img alt={source.name} src={getThumbnail(source.featuringImages)} />
            <div className="title">{source.name}</div>
        </Link>
    )
}