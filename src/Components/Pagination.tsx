import { Container, Pagination as PaginationMui, Typography, useTheme } from "@mui/material";
import { useState } from "react";


interface PaginationProps {
    pageChange: (x: number) => void;
    totalPages : number;
    totalItems : number;
}

export default function Pagination({ pageChange, totalPages, totalItems }: PaginationProps) {
    
    const theme = useTheme()
    const [page, setPage] = useState(1)

    function onChange(e : any, value : number) {
        setPage(value)
        pageChange(value)
    }

    return (
        <Container sx={{ 
            display : "flex", 
            padding : theme.spacing(2),
            alignItems : "center"
            }}>
            <PaginationMui count={totalPages} page={page} onChange={onChange} />
            <Typography variant="subtitle2" fontWeight="500"> {totalItems}</Typography>
        </Container>
    )
}