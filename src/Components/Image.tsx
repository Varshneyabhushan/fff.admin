
import config from "../config"

export default function Image({ imageId, alt }: { imageId: string, alt?: string }) {
    let src = "./nofems_400.svg"
    if (imageId.length !== 0) {
        let result = `${config.imageHostAPIUrl}/images/${imageId}`
        src = encodeURI(result)
    }

    return (
        <img
            src={src}
            alt={alt ?? imageId}
            loading="lazy"
        />
    )
}