
import "./index.scss"

import { useState } from "react"
import config from "../config"
import DbService from "../services/Db"
import { Model } from "../services/Db/models/model"
import ErrorBoundary from "../utils/resource/ErrorBoundary"
import Resource from "../utils/resource/Resource"
import toResource from "../utils/resource/toResource"


const dbService = new DbService(config.dbAPIUrl)
const initialModelsResource = toResource(dbService.getModels(0, 10))
type ModelsResource = Resource<Model[]>

export function ModelListPage() {

    const [resources, setResources] = useState <ModelsResource[]>([initialModelsResource])

    return (
        <ErrorBoundary fallback={"error while loading models"}>
            {resources.map(resource => <ModelList resource={resource}/>)}
        </ErrorBoundary>
    )
}

interface ModelListProps {
    resource : ModelsResource
}

function ModelList({ resource } : ModelListProps) {
    const models = resource.read()
    return (
        <div className="modelList">
            {models.map(model => <ModelContainer model={model}/>)}
        </div>
    )
}

function ModelContainer({ model } : { model : Model }) {
    return (
        <a className="modelContainer" href={`/models/${model._id}`}>
            <img src={`${config.imageHostAPIUrl}/images/${model.featuringImages?.[0].imageUrl}`} />
            <div className="title">{model.name}</div>
        </a>
    )
}