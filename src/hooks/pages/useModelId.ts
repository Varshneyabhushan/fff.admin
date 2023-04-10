import { useParams } from "react-router-dom"

export default function useModelId() {
    const { modelId = "" } = useParams()
    return modelId
}