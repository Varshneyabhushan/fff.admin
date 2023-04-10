
//use model that is passed in state 

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import config from "../../config";
import DbService from "../../services/Db";
import { Model } from "../../services/Db/models/model";

const dbService = new DbService(config.dbAPIUrl)

export function useModelId() {
    const { modelId = "" } = useParams()
    return modelId
}

//use model in location.state
//if not exist query for the model and send
export default function useModel() {
    const location = useLocation()
    const modelId = useModelId()
    const [model, setModel] = useState <Model>()

    useEffect(() => {
        if(location.state?.model) {
            setModel(location.state.model)
            return
        }

        dbService.getModelById(modelId)
            .then(
                model => setModel(model)
            )
    },
    [location.state, modelId])

    return model
}