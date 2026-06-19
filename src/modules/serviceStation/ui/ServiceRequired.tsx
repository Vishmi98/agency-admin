"use client"

import React, { useState } from 'react'
import { Box, Button, FormControl, FormControlLabel, Radio, RadioGroup, Step, StepContent, StepLabel, Stepper, Typography, useTheme } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LocalCarWashIcon from '@mui/icons-material/LocalCarWash';

import { STEPS } from '@/constants/data';


const ServiceRequired = () => {
    const [activeStep, setActiveStep] = useState(0);
    
    const theme = useTheme();

    const handleNext = () => {
        setActiveStep((prevActiveStep) => Math.min(prevActiveStep + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: { xs: "100%", md: "60%" } }}>
            <Typography variant='h6' color={theme.palette.text.primary}>Service Required</Typography>
            <Box sx={{ width: "100%", backgroundColor: theme.palette.background.default, color: theme.palette.text.primary, borderRadius: 2, padding: 2 }}>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {STEPS.map((step, index) => {
                        let stepIcon;
                        switch (step.label) {
                            case "Center Care":
                                stepIcon =
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 1, borderRadius: "100%", backgroundColor: "#70CF971A", color: "#70CF97" }}>
                                        <PersonIcon />
                                    </Box>;
                                break;
                            case "Diagnostics":
                                stepIcon =
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 1, borderRadius: "100%", backgroundColor: "#A162F71A", color: "#A162F7" }}>
                                        <ShowChartIcon />
                                    </Box>;
                                break;
                            case "Inner Cleaning":
                                stepIcon =
                                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 1, borderRadius: "100%", backgroundColor: "#FF7E861A", color: "#FF6370" }}>
                                        <LocalCarWashIcon />
                                    </Box>;
                                break;
                            default:
                                stepIcon = <PersonIcon />;
                        }

                        return (
                            <Step key={step.label}>
                                <StepLabel icon={stepIcon}>
                                    <Typography variant="h6">{step.label}</Typography>
                                </StepLabel>
                                {/* Conditionally render StepContent */}
                                {activeStep === index && (
                                    <StepContent>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Typography variant='body2' sx={{ borderRight: 1, paddingX: 2 }}>Price: {step.price}</Typography>
                                            <Typography variant='body2' >Processing: {step.price} hours</Typography>
                                        </Box>
                                    </StepContent>
                                )}
                            </Step>
                        );
                    })}
                </Stepper>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        variant="contained"
                    >
                        {activeStep === STEPS.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </Box>
            </Box>

            <Typography variant='h6' marginTop={3} sx={{ color: theme.palette.text.primary, }}>Service Schedule</Typography>
            <Box sx={{ width: "100%", color: theme.palette.text.primary, }}>
                <FormControl>
                    <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label={
                                <Box sx={{ display: "flex", flexDirection: "column" }}>
                                    <Typography variant="body1">Upgrade your favorite car periodically</Typography>
                                    <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
                                        <Typography variant='body2' sx={{ borderRight: 1, paddingX: 2 }}>Today, 10.00</Typography>
                                        <Typography variant='body2'>Fix Price : $1,200</Typography>
                                    </Box>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            value="male"
                            control={<Radio />}
                            label={
                                <Box sx={{ display: "flex", flexDirection: "column", marginTop: 2 }}>
                                    <Typography variant="body1">Buy spare parts for suspension</Typography>
                                    <Box sx={{ display: "flex", gap: 2, marginTop: 1 }}>
                                        <Typography variant='body2' sx={{ borderRight: 1, paddingX: 2 }}>Today, 10.00</Typography>
                                        <Typography variant='body2'>Fix Price : $1,200</Typography>
                                    </Box>
                                </Box>
                            }
                        />
                    </RadioGroup>
                </FormControl>
            </Box>
        </Box>
    );
}

export default ServiceRequired;
