
import "./index.scss"

import styled from "@emotion/styled"
import { Button, TextField } from "@mui/material"
import { ChangeEvent, useEffect, useReducer } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import config from "../../config"
import DbService from "../../services/Db"
import { featuringImage, measurements, Model } from "../../services/Db/models/model"
import getThumbnail from "../../utils/models/getThumbnail"
import modelReducer, { ModelPageState, modelReducerStates } from "./modelReducer"

const StyledTextField = styled(TextField)({
    padding: 8,
})

const dbService = new DbService(config.dbAPIUrl)

const defaultState: ModelPageState = {
    isEditing: false,
}

export default function ModelPage() {

    const location = useLocation()
    const { modelId : id } = useParams()
    const [state, dispatch] = useReducer(modelReducer, defaultState)
    const navigate = useNavigate()

    useEffect(() => {
        if (location.state?.model) {
            dispatch({ type: modelReducerStates.Setup, payload: location.state.model })
            return
        }

        dbService.getModelById(id ?? "")
            .then(model =>
                dispatch({ type: modelReducerStates.Setup, payload: model }))
    },
        [location.state, id])

    if (!state.model) {
        return <></>
    }

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

        dbService.getRandomImageOfModel(state.model?._id)
            .then(image => {
                if (!image) {
                    return
                }

                let payload: featuringImage = {
                    imageId: image._id,
                    imageUrl: image.url,
                }

                dispatch({ type: modelReducerStates.FeaturingImageChange, payload })
            })
    }

    return (
        <div>
            <div className="modelInfo">
                <div className="preview">
                    <img alt={state.model.name} src={getThumbnail(state.model.featuringImages)} /> <br />
                    {
                        state.isEditing ?
                            (
                                <>
                                    <Button onClick={getRandomPic}> random pic </Button>
                                    <Button onClick={onSave}>Save</Button>
                                    <Button onClick={() => setIsEditing(false)}> Cancel</Button>
                                </>

                            ) :
                            <Button onClick={() => setIsEditing(true)}> edit </Button>
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
                {
                    (state.model) ? (
                        <Link
                            style={{ textDecoration: "none" }}
                            to={`/models/${state.model._id}/albums`}
                        >
                            {<Button variant="contained"> goto albums</Button>}
                        </Link>
                    ) :
                        ""
                }

            </div>
        </div>
    )
}