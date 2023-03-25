
import { ModelsResource } from "."
import ModelLink from "../ModelPage/modelLink"
import { Model } from "../services/Db/models/model"
import getThumbnail from "../utils/models/getThumbnail"

interface ModelListProps {
    resource: ModelsResource
}

export default function ModelList({ resource }: ModelListProps) {
    return (
        <div className="modelList">
            {resource.read().map(model => <ModelContainer key={model._id} source={model} />)}
        </div>
    )
}

function ModelContainer({ source }: { source: Model }) {
    return (
        <ModelLink source={source}>
            <img alt={source.name} src={getThumbnail(source.featuringImages)} />
            <div className="title">{source.name}</div>
        </ModelLink>
    )
}