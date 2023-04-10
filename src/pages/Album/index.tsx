import { useLocation, useParams } from "react-router-dom"
import Album from "../../services/Db/models/album"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { getImageUrl } from "../../utils/models/getThumbnail";
import { ReactNode } from "react";
import DbService from "../../services/Db";
import config from "../../config";
import OptionsPicker from "../../Components/OptionsPicker";

const dbService = new DbService(config.dbAPIUrl)

export default function AlbumPage() {

    const location = useLocation()
    const { modelId } = useParams()

    if (!location.state?.album) {
        //implement loading
        return (
            <div>loading...</div>
        )
    }

    const album = location.state.album as Album

    function setAsModelPic(imageId: string) {
        dbService.updateModel({ _id: modelId, featuringImages: [imageId] })
            .then(() => alert("updated the model"))
            .catch((e) => {
                console.log(e)
                alert("error while updating : " + e.message)
            })
    }

    function setAsAlbumPic(imageId: string) {
        let featuringImages = [imageId]
        dbService.updateAlbum(album._id, { featuringImages } as any)
            .then(() => alert("updated the album"))
            .catch((e) => {
                console.log(e)
                alert("error while updating : " + e.message)
            })
    }

    return (
        <div>
            <ImageList sx={{ width: "100%", height: "maxHeight" }} cols={5} rowHeight={200}>
                {album.imageIds?.map((imageId) =>
                    <ImageListItem>
                        <OptionsPicker
                            options={["set as album pic", "set as model pic"]}
                            pick={(index) => {
                                if (index === 0) {
                                    setAsAlbumPic(imageId)
                                    return
                                }

                                setAsModelPic(imageId)
                            }}
                        />
                        <img
                            src={getImageUrl(imageId)}
                            loading="lazy"
                            alt={imageId}
                        />
                    </ImageListItem>) ?? ""}
            </ImageList>
        </div>
    )
}
