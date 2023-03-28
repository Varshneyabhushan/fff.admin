import { Button } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { HeaderState } from "../Header/state";
import { Model } from "../services/Db/models/model";

interface AlbumsListLinkProps {
    model: Model;
    children?: ReactNode;
}

export default function AlbumsListLink({ model, children }: AlbumsListLinkProps) {
    let headerState: HeaderState = {
        links: [
            { title: "models", link: '/models' },
            { title: model.name, link: `/models/${model._id}` },
            { title: "albums", link: `/models/${model._id}/albums` }
        ]
    }

    return (
        <Link
            style={{ textDecoration: "none" }}
            to={`/models/${model._id}/albums`}
            state={{
                header: headerState,
                model,
            }}
        >
            {children}
        </Link>
    )
}