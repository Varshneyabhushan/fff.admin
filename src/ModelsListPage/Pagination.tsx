import { Container, Pagination, Typography, useTheme } from "@mui/material";
import { useState } from "react";


interface ModelPaginationProps {
    pageChange: (x: number) => void;
    totalPages : number;
    totalModels : number;
}

export default function ModelPagination({ pageChange, totalPages, totalModels }: ModelPaginationProps) {
    
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
            <Typography variant="h6">
                {`total ${totalModels} models found`}
            </Typography>
            <Pagination count={totalPages} page={page} onChange={onChange} />
        </Container>
    )
}