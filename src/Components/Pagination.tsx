import { Container, Pagination as PaginationMui, Typography, useTheme } from "@mui/material";
import { useState } from "react";

interface PaginationProps {
    page: number,
    pageChange: (x: number) => void;
    totalPages: number;
    totalItems: number;
}

export default function Pagination({ page, pageChange, totalPages, totalItems }: PaginationProps) {

    const theme = useTheme()

    return (
        <Container sx={{
            display: "flex",
            padding: theme.spacing(2),
            alignItems: "center"
        }}>
            <PaginationMui
                count={totalPages}
                page={page}
                onChange={(e: any, value: number) => pageChange(value)}
            />
            <Typography variant="subtitle2" fontWeight="500"> {totalItems}</Typography>
        </Container>
    )
}