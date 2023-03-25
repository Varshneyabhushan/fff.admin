import { Link } from "react-router-dom";
import { Model } from "../services/Db/models/model";
import "./index.scss"

interface ModelLinkProps {
    children?: React.ReactNode;
    source : Model;
}

export default function ModelLink({ children, source } : ModelLinkProps) {
    const nextState = {
        header: { title: source.name },
        model : source,
    }

    return (
        <Link
            className="modelContainer"
            to={`/models/${source._id}`}
            state={nextState}
        >
            {children}
        </Link>
    )
}