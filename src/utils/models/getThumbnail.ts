import config from "../../config"


export default function getThumbnail(featuringImages?: string[]): string {
    let imageUrl = featuringImages?.[0] ?? ""
    return getImageUrl(imageUrl)
}

export function getImageUrl(url : string) : string {
    //default
    if(url.length === 0) {
        return "/nofems_400.svg"
    }

    let result = `${config.imageHostAPIUrl}/images/${url}`
    return encodeURI(result)
}