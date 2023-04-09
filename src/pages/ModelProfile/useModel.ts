
//use model that is passed in state 

import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import config from "../../config";
import DbService from "../../services/Db";
import { Model } from "../../services/Db/models/model";

const dbService = new DbService(config.dbAPIUrl)

//use model in location.state
//if not exist query for the model and send
export default function useModel() {
    const location = useLocation()
    const { modelId = "" } = useParams()

    const [model, setModel] = useState <Model | undefined>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(location.state?.model) {
            setModel(location.state.model)
            setLoading(false)
            return
        }

        dbService.getModelById(modelId)
            .then(
                model => setModel(model)
            )
            .finally(() => setLoading(false))
    },
    [location.state, modelId, setLoading])

    return [model, loading] as [Model, boolean]
}