import { useCallback, useState } from "react";
import Resource from "../../utils/resource/Resource";
import Album from "../../services/Db/models/album";
import { Model } from "../../services/Db/models/model";
import toResource from "../../utils/resource/toResource";
import DbService from "../../services/Db";
import config from "../../config";

const dbService = new DbService(config.dbAPIUrl)

type useAlbumsResult = [Resource<Album[]> | undefined, (newPage: number) => void]

export default function useAlbums(model: Model | undefined, albumsPerPage: number): useAlbumsResult {
    const [resource, setResource] = useState<Resource<Album[]>>()

    const pageChange = useCallback((newPage: number) => {
        if (!model) {
            return
        }

        let skip = (newPage - 1) * albumsPerPage
        let newResource = toResource(dbService.getAlbumsOfModel(model._id, skip, albumsPerPage))
        setResource(newResource)
    },
        [model, setResource])

    return [resource, pageChange]
}