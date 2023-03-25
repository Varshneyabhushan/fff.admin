import { useParams } from "react-router-dom"

export default function ModelPage() {

    const { id : modelId } = useParams()
    return (
        <div>
            you have entered a model's page : { modelId }
        </div>
    )
}