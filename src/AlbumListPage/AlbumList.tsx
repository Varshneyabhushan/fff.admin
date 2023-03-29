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
            {resource.read().map(album => <AlbumContainer key={album._id} album={album} modelName={model.name} />)}
        </div>
    )
}

interface AlbumContainerProps {
    album: Album;
    modelName : string;
}

function AlbumContainer({ album, modelName }: AlbumContainerProps) {
    
    const firstImage = getImageUrl(album.images?.[0]?.url ?? "")

    return (
        <div className="albumContainer">
            <img alt={modelName} src={firstImage} />
            <div className="title">{album.name}</div>
        </div>
    )
}