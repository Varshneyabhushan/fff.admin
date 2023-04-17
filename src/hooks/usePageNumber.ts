import { useCallback } from "react"
import { useSearchParams } from "react-router-dom"

export default function usePageNumber(defaultNumber: number) : [number, (x : number) => void] {
    const [searchParams, setSearchParams] = useSearchParams()

    const setPageNumber = useCallback((pageNumber: number) => {
        setSearchParams(
            searchParams => {
                searchParams.set("page", "" + pageNumber)
                return new URLSearchParams(searchParams)
            }
        )
    },
        [setSearchParams])

    let pageNumber = parseInt(searchParams.get("page") ?? "" + defaultNumber) ?? defaultNumber
    return [pageNumber, setPageNumber]
}