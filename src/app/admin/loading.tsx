import { Box, CircularProgress } from "@mui/material";


const Loading = () => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", marginTop: 30 }}>
            <CircularProgress />
        </Box>
    )
}

export default Loading;