import { useLocation } from "react-router-dom"
import Album from "../services/Db/models/album"
import { Model } from "../services/Db/models/model"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { getImageUrl } from "../utils/models/getThumbnail";


export default function AlbumPage() {

    const location = useLocation()
    if (!location.state.model || !location.state.album) {
        //implement loading
        return (
            <div>loading...</div>
        )
    }

    const model = location.state.model as Model
    const album = location.state.album as Album

    return (
        <div>
            {model._id}
            {album.name}
            <ImageList sx={{ width: "100%", height: "maxHeight" }} cols={5} rowHeight={200}>
                {album.images?.map((image) => (
                    <ImageListItem key={image.id}>
                        <img
                            src={getImageUrl(image.url)}
                            alt={image.id}
                            loading="lazy"
                        />
                    </ImageListItem>
                )) ?? ""}
            </ImageList>
        </div>
    )
}