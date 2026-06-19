"use client"

import React from 'react'
import { Avatar, AvatarGroup, Box, Typography, useTheme } from '@mui/material'


const UpcomingEvents = () => {
    const theme = useTheme();

    return (
        <Box sx={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            padding: 3,
            borderRadius: 3,
            border: "#ccc"
        }}>
            <Typography variant='h6'>
                Upcoming Events
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", marginTop: 3 }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
                    <Typography>
                        08:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#ccc", height: "2px" }} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography>
                        09:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#A162F7", padding: 1, borderRadius: 3, color: "#fff" }}>
                        <Typography>
                            Drift Series First Round
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
                            <Typography>
                                JDM
                            </Typography>
                            <AvatarGroup
                                max={3}
                                sx={{
                                    '& .MuiAvatar-root': {
                                        width: 24,
                                        height: 24,
                                        fontSize: '10px',
                                    }
                                }}
                            >
                                <Avatar alt="Remy Sharp" src="https://i.pinimg.com/236x/e0/1c/5c/e01c5ce4d41a6eb163edb1ff0c41e958.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Travis Howard" src="https://i.pinimg.com/236x/23/66/e3/2366e39b3bea7a6530b98b8ebf6a707c.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Cindy Baker" src="https://i.pinimg.com/474x/42/71/29/427129f37c004fefcc453d9649eba7ee.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Agnes Walker" src="https://i.pinimg.com/236x/b2/56/42/b256422ed45df565a723960119729969.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Trevor Henderson" src="https://i.pinimg.com/236x/49/cd/b9/49cdb94cac7d52731cf2c47db742da73.jpg" sx={{ width: 24, height: 24 }} />
                            </AvatarGroup>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography>
                        10:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#ccc", height: "2px" }} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography color="#ff0000">
                        10:15
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#ff0000", height: "2px" }} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography>
                        11:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#ccc", height: "2px" }} />
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography>
                        12:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#70CF97", padding: 1, borderRadius: 3, color: "#fff" }}>
                        <Typography>
                            Drift Series First Round
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 1 }}>
                            <Typography>
                                JDM
                            </Typography>
                            <AvatarGroup
                                max={3}
                                sx={{
                                    '& .MuiAvatar-root': {
                                        width: 24,
                                        height: 24,
                                        fontSize: '10px',
                                    }
                                }}
                            >
                                <Avatar alt="Remy Sharp" src="https://i.pinimg.com/236x/e0/1c/5c/e01c5ce4d41a6eb163edb1ff0c41e958.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Travis Howard" src="https://i.pinimg.com/236x/23/66/e3/2366e39b3bea7a6530b98b8ebf6a707c.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Cindy Baker" src="https://i.pinimg.com/474x/42/71/29/427129f37c004fefcc453d9649eba7ee.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Agnes Walker" src="https://i.pinimg.com/236x/b2/56/42/b256422ed45df565a723960119729969.jpg" sx={{ width: 24, height: 24 }} />
                                <Avatar alt="Trevor Henderson" src="https://i.pinimg.com/236x/49/cd/b9/49cdb94cac7d52731cf2c47db742da73.jpg" sx={{ width: 24, height: 24 }} />
                            </AvatarGroup>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
                    <Typography>
                        01:00
                    </Typography>
                    <Box sx={{ width: "80%", backgroundColor: "#ccc", height: "2px" }} />
                </Box>
            </Box>
        </Box>
    )
}

export default UpcomingEvents