
import "./index.scss"

import { Fragment, useEffect, useState, useTransition } from "react"
import config from "../config"
import DbService from "../services/Db"
import { Model } from "../services/Db/models/model"
import ErrorBoundary from "../utils/resource/ErrorBoundary"
import Resource from "../utils/resource/Resource"
import toResource from "../utils/resource/toResource"
import { Pagination } from "@mui/material"


const dbService = new DbService(config.dbAPIUrl)
const initialModelsResource = toResource(dbService.getModels(0, 10))
const modelsCountResource = toResource(dbService.getModelsCount())
type ModelsResource = Resource<Model[]>

export function ModelListPage() {
    
    const [resource, setResource] = useState<ModelsResource>(initialModelsResource)
    const [page, setPage] = useState(1)

    function pageChange(newPageVal : number) {
        setPage(newPageVal)
        let skip = (newPageVal - 1)* ModelsPerPage
        let newResource = toResource(dbService.getModels(skip, ModelsPerPage))
        setTimeout(() => setResource(newResource), 0)
    }

    return (
        <Fragment>
        <ErrorBoundary fallback={"error while loading pagination"}>
            <ModelPagination page={page} setPage={pageChange}/>
        </ErrorBoundary>
        <ErrorBoundary fallback={"error while loading models"}>
            <ModelList resource={resource} />
        </ErrorBoundary>
        </Fragment>
    )
}

interface ModelPaginationProps {
    page : number;
    setPage : (x : number) => void;
}

const ModelsPerPage = 20
function ModelPagination({ page, setPage } : ModelPaginationProps) {
    const totalModels = modelsCountResource.read()
    const totalPages = Math.ceil(totalModels/ModelsPerPage)

    return <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)}/>
}

interface ModelListProps {
    resource: ModelsResource
}

function ModelList({ resource }: ModelListProps) {
    return (
        <div className="modelList">
            {resource.read().map(model => <ModelContainer key={model._id} model={model} />)}
        </div>
    )
}

function ModelContainer({ model }: { model: Model }) {
    return (
        <a className="modelContainer" href={`/models/${model._id}`}>
            <img 
            alt={model.name} 
            src={`${config.imageHostAPIUrl}/images/${model.featuringImages?.[0].imageUrl}`} />
            <div className="title">{model.name}</div>
        </a>
    )
}