

import { Fragment, Suspense, useState } from "react"
import config from "../config"
import DbService from "../services/Db"
import { Model } from "../services/Db/models/model"
import ErrorBoundary from "../utils/resource/ErrorBoundary"
import Resource from "../utils/resource/Resource"
import toResource from "../utils/resource/toResource"
import ModelPagination from "./Pagination"
import ModelList from "./ModelList"
import { Button } from "@mui/material"
import "./modelList.scss"
import { useNavigate } from "react-router-dom"
import { getHeaderState } from "../ModelPage/modelLink"

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
                <ModelActions/>
                <ModelPagination pageChange={pageChange} totalPages={totalPages} totalModels={totalModels} />
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading models"}>
                <Suspense fallback={"loading modelList"}>
                    <ModelList resource={resource} />
                </Suspense>
            </ErrorBoundary>
        </Fragment>
    )
}

function ModelActions() {

    const navigate = useNavigate()

    function createNewModel() {
        let addingModel = { name : "hot lady"} as Model
        dbService.addModel(addingModel)
            .then(modelId => {
                addingModel._id = modelId

                let state = {
                    header : getHeaderState(addingModel),
                    model : addingModel,
                }

                alert("model created : " + modelId)
                navigate('/models/' + modelId, { state, replace : true })
            })
            .catch(e => alert("error while creating model : " + e?.message ?? ""))
    }

    return (
        <div className="modelActions">
            <Button onClick={createNewModel}>new model </Button>
        </div>
    )
}