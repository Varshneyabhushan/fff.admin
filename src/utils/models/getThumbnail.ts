import config from "../../config"
import { featuringImage } from "../../services/Db/models/model"


export default function getThumbnail(featuringImages?: featuringImage[]): string {
    //default 
    if (!featuringImages || featuringImages.length == 0) {
        return "/nofems_400.svg"
    }

    let featuringImage = featuringImages[0]
    return `${config.imageHostAPIUrl}/images/${featuringImage.imageUrl}`
}