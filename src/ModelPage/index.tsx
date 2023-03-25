
import styled from "@emotion/styled"
import { Button, TextField } from "@mui/material"
import { useState } from "react"
import config from "../config"
import DbService from "../services/Db"
import getThumbnail from "../utils/models/getThumbnail"
import useModelState from "./state"

const StyledTextField = styled(TextField)({
    padding: 8,
})

const dbService = new DbService(config.dbAPIUrl)

export default function ModelPage() {

    const modelResource = useModelState()
    const [isEditing, setIsEditing] = useState(false)
    if (!modelResource) {
        return <></>
    }

    const model = modelResource.read()

    return (
        <div>
            <div className="modelInfo">
                <div className="preview">
                    <img src={getThumbnail(model.featuringImages)} /> <br />
                    {
                        isEditing ?
                            (
                                <>
                                    <Button> first pic </Button>
                                    <Button>Save</Button>
                                    <Button onClick={() => setIsEditing(false)}> Cancel</Button>
                                </>

                            ) :
                            <Button onClick={() => setIsEditing(true)}> edit </Button>
                    }

                </div>
                <div className="details">
                    <StyledTextField variant="standard" value={model.name} label={"name"} disabled={!isEditing} /> <br />
                    <StyledTextField variant="standard" value={model.bio} label={"bio"} disabled={!isEditing} fullWidth /> <br />
                    <StyledTextField variant="standard" value={model.measurements?.bust} disabled={!isEditing} sx={{ width: 70 }} label={"bust"} />
                    <StyledTextField variant="standard" value={model.measurements?.waist} disabled={!isEditing} sx={{ width: 70 }} label={"waist"} />
                    <StyledTextField variant="standard" value={model.measurements?.hip} disabled={!isEditing} sx={{ width: 70 }} label={"hip"} /> <br />
                    <StyledTextField variant="standard" value={model.dob} disabled={!isEditing} label={"date of birth"} /> <br />
                    <StyledTextField variant="standard" value={model.ethnicity} disabled={!isEditing} label="ethnicity" />
                    <StyledTextField variant="standard" value={model.eyeColor} disabled={!isEditing} label="eyeColor" />
                    <StyledTextField variant="standard" value={model.skinColor} disabled={!isEditing} label="skinColor" />
                    <StyledTextField variant="standard" value={model.hairColor} disabled={!isEditing} label="hairColor" />
                </div>
            </div>
        </div>
    )
}