import { useLocation, useParams } from "react-router-dom"
import Album, { AlbumImage } from "../../services/Db/models/album"
import { featuringImage } from "../../services/Db/models/model"
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { getImageUrl } from "../../utils/models/getThumbnail";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import DbService from "../../services/Db";
import config from "../../config";

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

    function setAsModelPic(imageId: string, imageUrl: string) {
        let featuringImages: featuringImage[] = [
            { imageId, imageUrl }
        ]
        dbService.updateModel({ _id: modelId, featuringImages })
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
                {album.images?.map((image) => <ImageContainer
                    key={image.id}
                    image={image}
                    setAsAlbumPic={setAsAlbumPic}
                    setAsModelPic={setAsModelPic}
                />) ?? ""}
            </ImageList>
        </div>
    )
}

interface ImageContainerProps {
    image: AlbumImage;
    setAsModelPic: (imageId: string, imageUrl: string) => void;
    setAsAlbumPic: (imageId: string) => void;
}

function ImageContainer({ image, setAsModelPic, setAsAlbumPic }: ImageContainerProps) {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <ImageListItem key={image.id}>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                sx={{ padding: 1, position: 'absolute', right: 0 }}
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 20 * 4.5,
                        width: '15ch',
                    },
                }}
            >
                <MenuItem onClick={() => {
                    setAsAlbumPic(image.id)
                    handleClose()
                }}>
                    set as album pic
                </MenuItem>
                <MenuItem onClick={() => {
                    setAsModelPic(image.id, image.url)
                    handleClose()
                }}>
                    set as model pic
                </MenuItem>
            </Menu>
            <img
                src={getImageUrl(image.url)}
                alt={image.id}
                loading="lazy"
            />
        </ImageListItem>
    )
}