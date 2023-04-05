import { Button } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Model } from "../../services/Db/models/model";
import importFromURL from "./importFromURL";
import ImportURLFormDialog from "./ImportURLForm";
import "./index.scss"

export default function AlbumActions({ model } : { model : Model }) {

    const importAlbumFromURL = useCallback((url : string) => {
        importFromURL(model, url)
            .catch(err => {
                console.log('error while importing : ', err)
                alert("error while importing : " + err)
            })
    },[])

    const [open, setOpen] = useState(false)

    return (
        <div className="albumActions">
            <Button> create new </Button>
            <Button onClick={() => setOpen(true)}> import from URL </Button>
            <ImportURLFormDialog open={open} setOpen={setOpen} onSubmit={importAlbumFromURL}/>
        </div>
    )
}