import Album from "../services/Db/models/album"
import Resource from "../utils/resource/Resource"

interface AlbumListProps {
    resource : Resource<Album[]> 
}

export default function AlbumList({ resource } : AlbumListProps) {
    return (
        <div>
            {resource.read().map(album => <AlbumContainer key={album._id} album={album}/>)}
        </div>
    )
}

interface AlbumContainerProps {
    album : Album;
}

function AlbumContainer({ album } : AlbumContainerProps) {
    return (
        <div>
            {album._id}
            {album.name}
        </div>
    )
}