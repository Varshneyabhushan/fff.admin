import { Link } from "react-router-dom"
import { ModelsResource } from "."
import config from "../config"
import { featuringImage, Model } from "../services/Db/models/model"

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

function getThumbnail(featuringImages ?: featuringImage[]) : string {
    //default 
    if (!featuringImages || featuringImages.length == 0) {
        return "/nofems_400.svg"
    }

    let featuringImage = featuringImages[0]
    return `${config.imageHostAPIUrl}/images/${featuringImage.imageUrl}`
}

function ModelContainer({ source }: { source: Model }) {
    return (
        <Link className="modelContainer" to={`/models/${source._id}`}>
            <img alt={source.name} src={getThumbnail(source.featuringImages)} />
            <div className="title">{source.name}</div>
        </Link>
    )
}