import "./index.scss"

import { Suspense, useEffect, useState } from "react";
import { getImageUrl } from "../../utils/models/getThumbnail";

import { useLocation, useParams, Link } from "react-router-dom";
import Pagination from "../../Components/Pagination";
import config from "../../config";
import DbService from "../../services/Db";
import Album from "../../services/Db/models/album";
import { Model } from "../../services/Db/models/model";
import ErrorBoundary from "../../utils/resource/ErrorBoundary";
import Resource from "../../utils/resource/Resource";
import toResource from "../../utils/resource/toResource";
import AlbumActions from "./AlbumActions";
import useModel from "../ModelProfile/useModel";

export type AlbumsResource = Resource<Album[]>

const AlbumsPerPage = 20
const dbService = new DbService(config.dbAPIUrl)

export default function AlbumListPage() {

    const [resource, setResource] = useState<Resource<Album[]>>()
    const [countResource, setCountResource] = useState<Resource<number>>()

    const totalPages = Math.ceil((countResource?.read() ?? 0) / AlbumsPerPage)

    const [model, isModelLoading] = useModel()

    useEffect(() => {
        if(isModelLoading) {
            return
        }

        setCountResource(toResource(dbService.getAlbumsCount(model._id)))
    },
        [isModelLoading, model, setCountResource])

    useEffect(() => {
        if (!countResource) {
            return
        }

        if (countResource.read() !== 0) {
            pageChange(1)
        }
    },
        [countResource])

    if (isModelLoading) {
        return <div> loading... </div>
    }

    function pageChange(newPage: number) {
        if (!model) {
            return
        }

        let skip = (newPage - 1) * AlbumsPerPage
        let newResource = toResource(dbService.getAlbumsOfModel(model._id, skip, AlbumsPerPage))
        setResource(newResource)
    }

    return (
        <div>
            <AlbumActions model={model} />
            <ErrorBoundary fallback={"error while loading pagination"}>
                <Suspense>
                    <Pagination
                        pageChange={pageChange}
                        totalPages={totalPages}
                        totalItems={countResource?.read() ?? 0} />
                </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading albums"}>
                <Suspense>
                    {
                        (resource) ? <AlbumList resource={resource} model={model} /> : ""
                    }
                </Suspense>

            </ErrorBoundary>
        </div>
    )
}

function AlbumList({ resource, model }: { resource: Resource<Album[]>, model: Model }) {

    const albums = resource.read()

    return (
        <div className="albumList">
            {albums.map(
                album => <AlbumContainer key={album._id} album={album} model={model} />
            )}
        </div>
    )
}

function AlbumContainer({ album, model }: { album: Album, model: Model }) {

    let featuringImage = getImageUrl(album.featuringImages?.[0]?.url ?? album.images?.[0]?.url ?? "")

    return (
        <Link to={`/models/${model._id}/albums/${album._id}`} state={{album}}>
            <div className="albumContainer">
                <img alt={model.name} src={featuringImage} />
                <div className="title">{album.name}</div>
            </div>
        </Link>
    )
}