import { Link } from "react-router-dom";
import { getHeaderState } from "../ModelPage/modelLink";
import Album from "../services/Db/models/album"
import { Model } from "../services/Db/models/model";
import getThumbnail, { getImageUrl } from "../utils/models/getThumbnail";
import Resource from "../utils/resource/Resource"
import "./albumList.scss"

interface AlbumListProps {
    resource: Resource<Album[]>;
    model : Model;
}

export default function AlbumList({ resource, model }: AlbumListProps) {
    return (
        <div className="albumList">
            {resource.read().map(album => <AlbumContainer key={album._id} album={album} model={model} />)}
        </div>
    )
}

interface AlbumContainerProps {
    album: Album;
    model : Model;
}

function AlbumContainer({ album, model }: AlbumContainerProps) {
    
    const firstImage = getImageUrl(album.images?.[0]?.url ?? "")

    const headerState = getHeaderState(model)
    headerState.links.push({ link : "./" + album._id, title : album.name })
    const nextState = {
        header : headerState,
        model,
        album
    }

    return (
        <Link 
        to={`./${album._id}`}
        state={nextState}
        >
        <div className="albumContainer">
            <img alt={model.name} src={firstImage} />
            <div className="title">{album.name}</div>
        </div>
        </Link>
    )
}