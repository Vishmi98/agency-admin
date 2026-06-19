"use client";

import React from "react";
import { Box, TextField, Button } from "@mui/material";

import { PackageSearchProps } from "../package.types";


const PackageSearch: React.FC<PackageSearchProps> = ({
    onSearch,
    setSearch,
    handleClearSearch,
    search,
}) => {

    const handleSearch = async () => {
        if (search.trim() === "") {
            return;
        }
        else {
            onSearch()
        }
    };

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                paddingX: "10px",
                paddingY: "10px",
                borderRadius: "5px",
                width: "100%"
            }}
        >
            <Box sx={{ display: "flex", gap: 3, width: "50%" }}>
                <TextField
                    fullWidth
                    label="Search Package"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    sx={{ width: "25%" }}
                >
                    Search
                </Button>
                <Button
                    variant="contained"
                    color='inherit'
                    onClick={handleClearSearch}
                    sx={{ width: "25%" }}
                >
                    Clear
                </Button>
            </Box>
        </Box>
    );
};

export default PackageSearch;