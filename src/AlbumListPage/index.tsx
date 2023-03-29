import { Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import config from "../config";
import DbService from "../services/Db";
import Album from "../services/Db/models/album";
import { Model } from "../services/Db/models/model";
import ErrorBoundary from "../utils/resource/ErrorBoundary";
import Resource from "../utils/resource/Resource";
import toResource from "../utils/resource/toResource";
import AlbumList from "./AlbumList";
import AlbumPagination from "./Pagination";

export type AlbumsResource = Resource<Album[]>

const AlbumsPerPage = 20
const dbService = new DbService(config.dbAPIUrl)

export default function AlbumListPage() {

    const [resource, setResource] = useState<Resource<Album[]>>()
    const [countResource, setCountResource] = useState<Resource<number>>()
    const location = useLocation()

    const totalPages = Math.ceil((countResource?.read() ?? 0) / AlbumsPerPage)

    useEffect(() => {
        if (!location.state.model) {
            return
        }

        let model = location.state.model as Model
        setCountResource(toResource(dbService.getAlbumsCount(model._id)))
    },
        [location.state])

    useEffect(() => {
        if(!countResource) {
            return 
        }

        if(countResource.read() !== 0) {
            pageChange(1)
        }
    },
    [countResource])

    function pageChange(newPage: number) {
        if (!location.state.model) {
            return
        }

        let model = location.state.model as Model
        let skip = (newPage - 1) * AlbumsPerPage
        let newResource = toResource(dbService.getAlbumsOfModel(model._id, skip, AlbumsPerPage))
        setResource(newResource)
    }

    return (
        <div>
            <ErrorBoundary fallback={"error while loading pagination"}>
                <Suspense>
                    <AlbumPagination
                        pageChange={pageChange}
                        totalPages={totalPages}
                        totalAlbums={countResource?.read() ?? 0} />
                </Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={"error while loading albums"}>
                <Suspense>
                    {
                        (resource) ? <AlbumList resource={resource} model={location.state.model} /> : ""
                    }
                </Suspense>

            </ErrorBoundary>
        </div>
    )
}