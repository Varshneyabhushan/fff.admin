import { useLocation, useParams } from "react-router-dom";
import Album from "../../services/Db/models/album";
import { useEffect, useState } from "react";
import DbService from "../../services/Db";
import config from "../../config";

let dbService = new DbService(config.dbAPIUrl)

export default function useAlbum() {
    const location = useLocation()
    const { albumId = ""} = useParams()

    const [album, setAlbum] = useState <Album>()

    useEffect(() => {
        if(location.state?.album) {
            setAlbum(location.state.album)
            return
        }

        dbService.getAlbumById(albumId)
            .then(album => setAlbum(album))
    },
    [location.state, albumId])

    return album
}