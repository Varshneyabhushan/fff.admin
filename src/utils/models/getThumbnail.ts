import config from "../../config"
import { featuringImage } from "../../services/Db/models/model"


export default function getThumbnail(featuringImages?: featuringImage[]): string {
    let imageUrl = featuringImages?.[0]?.imageUrl ?? ""
    return getImageUrl(imageUrl)
}

export function getImageUrl(url : string) : string {
    //default
    if(url.length === 0) {
        return "/nofems_400.svg"
    }

    return `${config.imageHostAPIUrl}/images/${url}`
}