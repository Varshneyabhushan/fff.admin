import { Button } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import config from "../../config"
import { getHeaderState } from "../../ModelPage/modelLink"
import DbService from "../../services/Db"
import { Model } from "../../services/Db/models/model"
import ImportURLFormDialog from "./ImportURLForm"

const dbService = new DbService(config.dbAPIUrl)

export default function ModelActions() {

    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

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

    function importModel(url : string) {
        
    }

    return (
        <div className="modelActions">
            <Button onClick={createNewModel}>new model </Button>
            <Button onClick={() => setOpen(true)}> import model </Button>
            <ImportURLFormDialog onSubmit={importModel} open={open} setOpen={setOpen}/>
        </div>
    )
}