import "./index.scss"

import { Suspense, useEffect } from "react";
import { getImageUrl } from "../../utils/models/getThumbnail";

import { Link } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import Album from "../../services/Db/models/album";
import { Model } from "../../services/Db/models/model";
import ErrorBoundary from "../../utils/resource/ErrorBoundary";
import AlbumActions from "./AlbumActions";
import useModel from "../../hooks/pages/useModel";
import useAlbumCount from "../../hooks/pages/useAlbumCount";
import useAlbums from "../../hooks/pages/useAlbums";

const AlbumsPerPage = 20


export default function AlbumListPage() {

    const model = useModel()
    const albumCountResource = useAlbumCount(model)
    const [albumsResource, pageChange] = useAlbums(model, AlbumsPerPage)

    const totalPages = Math.ceil((albumCountResource?.read() ?? 0) / AlbumsPerPage)

    useEffect(() => {
        if (!albumCountResource || albumCountResource.read() === 0) {
            return
        }

        pageChange(1)
    },
        [albumCountResource, pageChange])

    if (!model) {
        return <div> loading... </div>
    }

    return (
        <div>
            <AlbumActions model={model} />
            <ErrorBoundary fallback={"error while loading pagination"}>
                <Suspense>
                    <Pagination
                        pageChange={pageChange}
                        totalPages={totalPages}
                        totalItems={albumCountResource?.read() ?? 0} />
                </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading albums"}>
                <Suspense>
                    {
                        (albumsResource) ? (
                            <div className="albumList">
                                {albumsResource.read().map(
                                    album => <AlbumContainer key={album._id} album={album} model={model} />
                                )}
                            </div>
                        ) : ""
                    }
                </Suspense>

            </ErrorBoundary>
        </div>
    )
}

function AlbumContainer({ album, model }: { album: Album, model: Model }) {

    let featuringImage = getImageUrl(album.featuringImages?.[0] ?? album.imageIds?.[0] ?? "")

    return (
        <Link to={`/models/${model._id}/albums/${album._id}`} state={{ album }}>
            <div className="albumContainer">
                <img alt={model.name} src={featuringImage} />
                <div className="title">{album.name}</div>
            </div>
        </Link>
    )
}