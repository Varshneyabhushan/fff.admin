
import "./index.scss"

import { Fragment, Suspense, useEffect } from "react"
import { Link } from "react-router-dom";

import config from "../../config"
import DbService from "../../services/Db"
import { Model } from "../../services/Db/models/model"
import ErrorBoundary from "../../utils/resource/ErrorBoundary"
import Resource from "../../utils/resource/Resource"
import toResource from "../../utils/resource/toResource"
import Pagination from "../../Components/Pagination"
import ModelActions from "./Actions"
import useModels from "../../hooks/pages/useModels";
import FeaturingImages from "../../Components/FeaturingImages";
import usePageNumber from "../../hooks/usePageNumber";

const dbService = new DbService(config.dbAPIUrl)
const ModelsPerPage = 20
const modelsCountResource = toResource(dbService.getModelsCount())
export type ModelsResource = Resource<Model[]>

export function ModelListPage() {

    const [modelsResource, loadPage] = useModels(ModelsPerPage)

    const totalModels = modelsCountResource.read()
    const totalPages = Math.ceil(totalModels / ModelsPerPage)

    const [pageNumber, setPageNumber] = usePageNumber(1)
    useEffect(() => {
        loadPage(pageNumber)
    },
    [pageNumber, loadPage])

    return (
        <Fragment>
            <ErrorBoundary fallback={"error while loading pagination"}>
                <ModelActions />
                <Pagination
                    page={pageNumber}
                    pageChange={setPageNumber}
                    totalPages={totalPages}
                    totalItems={totalModels}
                />
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading models"}>
                <Suspense fallback={"loading modelList"}>
                    <div className="model-list">
                        {modelsResource?.read()
                            .map(model => <ModelContainer key={model._id} source={model} />)
                        }
                    </div>
                </Suspense>
            </ErrorBoundary>
        </Fragment>
    )
}


function ModelContainer({ source }: { source: Model }) {
    return (
        <Link
            className="model-container"
            to={`/models/${source._id}`}
            state={{
                model: source,
            }}
        >
            <FeaturingImages imageIds={source.featuringImages} alt={source.name} />
            <div className="title">{source.name}</div>
        </Link>
    )
}