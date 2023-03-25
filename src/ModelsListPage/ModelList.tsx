import { ModelsResource } from "."
import config from "../config"
import { Model } from "../services/Db/models/model"

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

    let modelThumbnail = "/nofems_400.svg"
    let featuringImage = source.featuringImages?.[0].imageUrl
    if (featuringImage) {
        modelThumbnail = `${config.imageHostAPIUrl}/images/${featuringImage}`
    }

    return (
        <a className="modelContainer" href={`/models/${source._id}`}>
            <img
                alt={source.name}
                src={modelThumbnail} />
            <div className="title">{source.name}</div>
        </a>
    )
}