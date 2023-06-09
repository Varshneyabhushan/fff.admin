
import "./index.scss"

import styled from "@emotion/styled"
import { Button, TextField, Typography } from "@mui/material"
import { ChangeEvent, useCallback, useEffect, useReducer } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import config from "../../config"
import DbService from "../../services/Db"
import { measurements, Model } from "../../services/Db/models/model"
import modelReducer, { ModelPageState, modelReducerStates } from "./modelReducer"
import AlbumList from "../AlbumList"
import useModel from "../../hooks/pages/useModel"
import FeaturingImages from "../../Components/FeaturingImages"

const StyledTextField = styled(TextField)({
    padding: 8,
})

const dbService = new DbService(config.dbAPIUrl)

const defaultState: ModelPageState = {
    isEditing: false,
}

export default function ModelPage() {

    const location = useLocation()
    const [state, dispatch] = useReducer(modelReducer, defaultState)
    const model = useModel()
    const navigate = useNavigate()

    useEffect(() => {
        if (!model) {
            return
        }

        dispatch({ type: modelReducerStates.Setup, payload: model })
    },
        [model, dispatch])

    async function onSave() {
        setIsEditing(false)
        if (!state.model) {
            alert('invalid model to save')
            return
        }

        try {
            await dbService.updateModel(state.model)
            location.state.model = state.model
            navigate(".", { state: location.state })
            //better alert
            alert("saved the changes")
        }
        catch (e: any) {
            console.log("error when updating : ", e)

            // throw new Error("error while saving model : " + e.message)
        }
    }


    function setIsEditing(status: boolean) {
        dispatch({ type: modelReducerStates.EditingChange, payload: status })
    }

    function fieldSetter(fieldName: keyof Model) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            let payload = {
                fieldName,
                value: e.target.value,
            }

            dispatch({ type: modelReducerStates.FieldChange, payload })
        }
    }

    function measurementsSetter(fieldName: keyof measurements) {
        return (e: ChangeEvent<HTMLInputElement>) => {
            let payload = {
                fieldName,
                value: e.target.value,
            }

            dispatch({ type: modelReducerStates.MeasurementsChange, payload })
        }
    }

    function getRandomPic() {
        if (!state.model) {
            return
        }

        dbService.getRandomImageOfModel(state.model._id)
            .then(image => {
                if (!image) {
                    return
                }

                let payload = image._id
                dispatch({ type: modelReducerStates.FeaturingImageChange, payload })
            })
    }

    const deleteModel = useCallback(() => {
        if (!state.model) {
            return
        }

        dbService.deleteModel(state.model._id)
            .then(result => {
                alert(`deleted ${result.albumCount} albums and ${result.imageCount} images`)
                navigate(-1)
            })
            .catch(e => {
                alert("error while deleting")
                console.log(e)
            })
    },
        [navigate, state])

    if (!state.model) {
        return <></>
    }

    return (
        <div>
            <div className="modelInfo">
                <div className="preview">
                    <FeaturingImages imageIds={state.model.featuringImages} alt={state.model.name} /> <br />
                    {
                        state.isEditing ?
                            (
                                <>
                                    <Button onClick={getRandomPic}> random pic </Button>
                                    <Button onClick={onSave}>Save</Button>
                                    <Button onClick={() => setIsEditing(false)}> Cancel</Button>
                                </>

                            ) : (
                                <>
                                    <Button onClick={() => setIsEditing(true)}> edit </Button>
                                    <Button onClick={() => deleteModel()}> delete </Button>
                                </>
                            )
                    }

                </div>
                <div className="details">
                    <StyledTextField
                        variant="standard"
                        label={"name"}
                        value={state.model.name}
                        onChange={fieldSetter("name")}
                        disabled={!state.isEditing} /> <br />
                    <StyledTextField
                        variant="standard"
                        label={"bio"}
                        value={state.model.bio ?? ""}
                        onChange={fieldSetter("bio")}
                        disabled={!state.isEditing} fullWidth /> <br />
                    <StyledTextField
                        variant="standard"
                        label={"bust"}
                        value={state.model.measurements?.bust ?? ""}
                        onChange={measurementsSetter("bust")}
                        disabled={!state.isEditing}
                        sx={{ width: 70 }}
                    />
                    <StyledTextField
                        variant="standard"
                        label={"waist"}
                        value={state.model.measurements?.waist ?? ""}
                        onChange={measurementsSetter("waist")}
                        disabled={!state.isEditing}
                        sx={{ width: 70 }}
                    />
                    <StyledTextField
                        variant="standard"
                        label={"hip"}
                        value={state.model.measurements?.hip ?? ""}
                        onChange={measurementsSetter("hip")}
                        disabled={!state.isEditing}
                        sx={{ width: 70 }}
                    />
                    <br />
                    <StyledTextField
                        variant="standard"
                        label={"date of birth"}
                        value={state.model.dob ?? ""}
                        onChange={fieldSetter("dob")}
                        disabled={!state.isEditing}
                    />
                    <br />
                    <StyledTextField
                        variant="standard"
                        label="ethnicity"
                        value={state.model.ethnicity ?? ""}
                        onChange={fieldSetter("ethnicity")}
                        disabled={!state.isEditing}
                    />
                    <StyledTextField
                        variant="standard"
                        label="eyeColor"
                        value={state.model.eyeColor ?? ""}
                        onChange={fieldSetter("eyeColor")}
                        disabled={!state.isEditing}
                    />
                    <StyledTextField
                        variant="standard"
                        label="skinColor"
                        value={state.model.skinColor ?? ""}
                        onChange={fieldSetter("skinColor")}
                        disabled={!state.isEditing}
                    />
                    <StyledTextField
                        variant="standard"
                        label="hairColor"
                        value={state.model.hairColor ?? ""}
                        onChange={fieldSetter("hairColor")}
                        disabled={!state.isEditing}
                    />
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <Typography variant="h4"> Albums </Typography>
            </div>
            <AlbumList />
        </div>
    )
}