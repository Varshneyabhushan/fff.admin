
import config from "../config"

interface ImageProps {
    imageId: string;
    alt?: string;
    className?: string;
}

export default function Image({ imageId, alt, className }: ImageProps) {
    let src = "http://localhost:3000/nofems_400.svg"

    if (imageId.length !== 0) {
        let result = `${config.imageHostAPIUrl}/images/${imageId}`
        src = encodeURI(result)
    }

    return (
        <img
            src={src}
            alt={alt ?? imageId}
            loading="lazy"
            className={className}
        />
    )
}