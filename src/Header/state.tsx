import { useLocation } from "react-router-dom";

interface HeaderLink {
    title : string;
    link : string;
}

export interface HeaderState {
    links : HeaderLink[];
}

const defaultState : HeaderState = { links : [{ title : "models", link : "/models"}] }

export default function useHeaderState() : HeaderState {
    const location = useLocation()
    const { links } = location.state?.header ?? defaultState
    return {
        links
    }
}