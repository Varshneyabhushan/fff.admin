import { Fragment, useEffect, useState } from "react"
import config from "../config"

export default function Image({ imageId }: { imageId: string }) {

    const [url, setUrl] = useState("./nofems_400.svg")

    useEffect(() => {
        //default
        if (imageId.length === 0) {
            return
        }

        setUrl(encodeURI(`${config.imageHostAPIUrl}/images/${imageId}`))
    },
        [imageId, setUrl])

    return (
        <img
            src={url}
            alt={imageId}
            loading="lazy"
        />
    )
}