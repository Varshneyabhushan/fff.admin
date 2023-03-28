import { Link } from "react-router-dom";
import { HeaderState } from "../Header/state";
import { Model } from "../services/Db/models/model";
import "./index.scss"

interface ModelLinkProps {
    children?: React.ReactNode;
    source : Model;
}

export function getHeaderState(model : Model) : HeaderState {
    return { 
        links : [
            { title : "models", link : "/models" },
            { title : model.name, link : "/models/" + model._id }
        ]
    }
}

export default function ModelLink({ children, source } : ModelLinkProps) {

    return (
        <Link
            className="modelContainer"
            to={`/models/${source._id}`}
            state={{
                header: getHeaderState(source),
                model : source,
            }}
        >
            {children}
        </Link>
    )
}