
import { measurements, Model } from "../services/Db/models/model";

export interface ModelPageState {
    model ?: Model;
    isEditing : boolean;
}

interface Action {
    type : modelReducerStates;
    payload : any;
}

export enum modelReducerStates {
    Setup,
    EditingChange,
    FieldChange,
    MeasurementsChange,
    FeaturingImageChange,
}

export default function modelReducer(state : ModelPageState, action : Action) : ModelPageState {
    
    let newState = { ...state }
    switch(action.type) {
        case modelReducerStates.Setup:
            newState.model = action.payload
            return newState

        case modelReducerStates.EditingChange:
            newState.isEditing = action.payload
            return newState

        case modelReducerStates.FieldChange:
            let fieldName = action.payload.fieldName as keyof Model
            if(!fieldName || !newState.model) {
                return newState
            }

            newState.model[fieldName] = action.payload.value
            return newState

        case modelReducerStates.MeasurementsChange:
            if(!newState.model) {
                return newState
            }

            if(!newState.model.measurements) {
                newState.model.measurements = {}
            }

            let measurement = action.payload.fieldName as keyof measurements
            newState.model.measurements[measurement] = action.payload.value
            return newState

        case modelReducerStates.FeaturingImageChange:
            if(!newState.model) {
                return newState
            }

            if(!newState.model.featuringImages || newState.model.featuringImages.length === 0) {
                newState.model.featuringImages = [action.payload]
                return newState
            }

            newState.model.featuringImages[0] = action.payload
            return newState
            
        default:
            return state
    }
}