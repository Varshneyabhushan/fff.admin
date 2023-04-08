import { Suspense, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import config from "../../config";
import DbService from "../../services/Db";
import Album from "../../services/Db/models/album";
import { Model } from "../../services/Db/models/model";
import ErrorBoundary from "../../utils/resource/ErrorBoundary";
import Resource from "../../utils/resource/Resource";
import toResource from "../../utils/resource/toResource";
import AlbumActions from "./AlbumActions";
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

    const { id } = useParams()
    let [model, setModel] = useState<Model|undefined>()

    useEffect(() => {
        let modelId = id ?? ""
        setCountResource(toResource(dbService.getAlbumsCount(modelId)))
        if (!location.state?.model) {
            dbService.getModelById(modelId)
                .then(model => setModel(model))

            return
        }

        model = location.state.model as Model
        setModel(model)
        
    },
        [location.state, id, setModel, setCountResource])

    useEffect(() => {
        if(!countResource) {
            return 
        }

        if(countResource.read() !== 0) {
            pageChange(1)
        }
    },
    [countResource])

    if(model === undefined) {
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
            <AlbumActions model={model}/>
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
                        (resource) ? <AlbumList resource={resource} model={model} /> : ""
                    }
                </Suspense>

            </ErrorBoundary>
        </div>
    )
}