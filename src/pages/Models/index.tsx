
import "./index.scss"

import { Fragment, Suspense } from "react"
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
import useModels from "./useModels";

const dbService = new DbService(config.dbAPIUrl)
const ModelsPerPage = 20
const modelsCountResource = toResource(dbService.getModelsCount())
export type ModelsResource = Resource<Model[]>

export function ModelListPage() {

    const [models, loadPage] = useModels(ModelsPerPage)

    const totalModels = modelsCountResource.read()
    const totalPages = Math.ceil(totalModels / ModelsPerPage)

    return (
        <Fragment>
            <ErrorBoundary fallback={"error while loading pagination"}>
                <ModelActions />
                <Pagination pageChange={loadPage} totalPages={totalPages} totalItems={totalModels} />
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading models"}>
                <Suspense fallback={"loading modelList"}>
                    <ModelList resource={models} />
                </Suspense>
            </ErrorBoundary>
        </Fragment>
    )
}


function ModelList({ resource }: { resource: ModelsResource }) {

    let models = resource.read()

    return (
        <div className="modelList">
            {models.map(model => <ModelContainer key={model._id} source={model} />)}
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