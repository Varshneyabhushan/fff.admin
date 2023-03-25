
import useModelState from "./state"

export default function ModelPage() {

    const modelResource = useModelState()
    if(!modelResource) {
        return <></>
    }

    const model = modelResource.read()

    return (  
         <div>
            {`modelId : ${ model._id }`}
            {`modelName : ${model.name}`}
        </div>
    )
}