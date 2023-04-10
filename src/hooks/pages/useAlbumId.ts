import { useParams } from "react-router-dom"

export default function useAlbumId() {
    const { albumId = ""} = useParams()
    return albumId
}