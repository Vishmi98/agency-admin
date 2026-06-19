import React from 'react';
import { Avatar, Box, Button, Grid, TextField, Typography, InputAdornment } from '@mui/material';
import { LocationOn, Email, Cake, Male, Home } from '@mui/icons-material';


const Profile = () => {
    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Header Section */}
            <Box sx={{ borderBottom: 1, borderColor: '#E9EAEC', pb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Profile</Typography>
                <Typography variant="body2" color="textSecondary">
                    Update your photo and personal details here.
                </Typography>
            </Box>

            {/* Personal Details */}
            <Box sx={{ borderBottom: 1, borderColor: '#E9EAEC', pb: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Personal Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="live-in"
                            label="Live in"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value="Colombo, Sri Lanka"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocationOn />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="street-address"
                            label="Street Address"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value="123 Main Street"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Home />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="email"
                            label="Email Address"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value="example@example.com"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="date-of-birth"
                            label="Date Of Birth"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value="1990-01-01"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Cake />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="gender"
                            label="Gender"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value="Male"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Male />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Photo Section */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: {xs: 'flex-start', md:'center'},
                    justifyContent: 'space-between',
                    borderBottom: 1,
                    borderColor: '#E9EAEC',
                    pb: 4,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">
                            Your photo
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            This will be displayed on your profile.
                        </Typography>
                    </Box>
                    <Avatar src="/p5.jpg" sx={{ width: 64, height: 64 }} />
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="text" sx={{ color: '#7C7C8D' }}>
                        Delete
                    </Button>
                    <Button variant="text" sx={{ color: '#A162F7' }}>
                        Update
                    </Button>
                </Box>
            </Box>

            {/* Social Profiles */}
            <Box>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Social Profiles
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="facebook-profile"
                            label="facebook.com/"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            id="twitter-profile"
                            label="twitter.com/"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Profile;
