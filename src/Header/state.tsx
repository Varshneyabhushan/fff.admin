import { useLocation } from "react-router-dom";

interface HeaderState {
    title : string;
}

const defaultState : HeaderState = { title : "models" }

export default function useHeaderState() : HeaderState {
    const location = useLocation()
    const { title } = location.state?.header ?? defaultState
    return {
        title
    }
}