
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Model } from "../../services/Db/models/model";

interface AlbumsListLinkProps {
    model: Model;
    children?: ReactNode;
}

export default function AlbumsListLink({ model, children }: AlbumsListLinkProps) {

    return (
        <Link
            style={{ textDecoration: "none" }}
            to={`/models/${model._id}/albums`}
            state={{
                model,
            }}
        >
            {children}
        </Link>
    )
}