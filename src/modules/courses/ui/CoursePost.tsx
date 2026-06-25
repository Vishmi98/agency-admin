"use client";

import React, { useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Stack,
    Grid,
    Divider,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InfoIcon from '@mui/icons-material/Info';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import LanguageIcon from '@mui/icons-material/Language';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { CourseProp } from '../courses.types';
import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';

const CoursePost: React.FC<CourseProp> = ({ course, setIsModalOpen }) => {
    const courseRef = useRef<HTMLDivElement>(null);
    const user = getCookieUser();

    // Primary Colors matched from the flyer
    const PRIMARY_DARK = '#0a2e5c';
    const SECONDARY_BLUE = '#0284c7';
    const ACCENT_LIGHT = '#e0f2fe';
    const TEXT_MUTED = '#4b5563';

    const handleDownloadImage = async () => {
        const html2canvas = (await import("html2canvas")).default;
        const element = courseRef.current;
        if (!element) return;

        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSE_POST_DOWNLOAD_IMAGE",
                path: "/modules/courses/ui/CoursePost",
                method: "CLIENT",
                meta: {
                    courseId: course.id,
                    courseTitle: course.title,
                },
            });
        }

        // 1. Render original canvas
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        // 2. Create a fixed-size canvas (1080x1350)
        const targetWidth = 1080;
        const targetHeight = 1350;

        const finalCanvas = document.createElement("canvas");
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;

        const ctx = finalCanvas.getContext("2d");
        if (!ctx) return;

        // 3. Fill background (important for clean export)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);

        // 4. Draw scaled image into fixed canvas
        ctx.drawImage(
            canvas,
            0,
            0,
            canvas.width,
            canvas.height,
            0,
            0,
            targetWidth,
            targetHeight
        );

        // 5. Download
        const image = finalCanvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = `${course.title
            .toLowerCase()
            .replace(/\s+/g, "-")}-1080x1350.png`;

        link.click();
    };

    const handleClose = () => {
        setIsModalOpen(false);
        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSE_POST_MODAL_CLOSE",
                path: "/modules/courses/ui/CoursePost",
                method: "CLIENT",
                meta: { courseId: course.id },
            });
        }
    };

    return (
        <Box sx={{
            maxWidth: 850, // Standard width optimized for single page A4 portrait scaling
            margin: 'auto',
        }}>
            {/* Top Header Action Bar (Excluded from PDF) */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: '0px 0px 14px 0px',
            }}>
                <Typography variant="subtitle2" sx={{ color: '#000', fontWeight: 600 }}>
                    Course Overview
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <IconButton
                        onClick={handleDownloadImage}
                        size="small"
                        sx={{ bgcolor: '#e0f2fe', color: '#0284c7', '&:hover': { bgcolor: '#bae6fd' }, transition: 'all 0.2s' }}
                        title="Download PDF Overview"
                    >
                        <DownloadIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        onClick={handleClose}
                        size="small"
                        sx={{ bgcolor: '#fef2f2', color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' }, transition: 'all 0.2s' }}
                        title="Close Window"
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Stack>
            </Box>

            {/* Printable Content Section */}
            <Box ref={courseRef} sx={{
                bgcolor: '#ffffff',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
            }}>

                {/* 1. HERO SECTION WITH IMAGE & HERO TITLE */}
                <Grid container sx={{ position: 'relative', minHeight: '300px' }}>
                    {/* Left Branding and Title Column */}
                    <Grid item xs={12} md={6} sx={{ px: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
                        {/* University Branding Mock */}
                        <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
                            <SchoolIcon sx={{ fontSize: 40, color: PRIMARY_DARK }} />
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 800,
                                        color: PRIMARY_DARK,
                                        lineHeight: 1.1,
                                        letterSpacing: '0.5px',
                                        fontFamily: '"Times New Roman", Times, serif',
                                    }}
                                >
                                    UNIVERSITY
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 100 }}>
                                    Inspiring Futures
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Tagline Badge */}
                        <Box sx={{ bgcolor: PRIMARY_DARK, color: '#fff', width: 'fit-content', px: 2, py: 0.6, borderRadius: '20px', mb: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                                Elevate Your Future
                            </Typography>
                        </Box>

                        {/* Course Title */}
                        <Typography variant="h3" sx={{ fontWeight: 800, color: PRIMARY_DARK, textTransform: 'uppercase', lineHeight: 1.1, mb: 1 }}>
                            {course.title || ""}
                        </Typography>

                        <Divider sx={{ width: '60px', borderBottomWidth: 3, borderColor: SECONDARY_BLUE, mb: 2 }} />

                        <Typography variant="body2" sx={{ maxWidth: '100%' }}>
                            {course.description || ""}
                        </Typography>
                    </Grid>

                    {/* RIGHT SIDE IMAGE */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{
                            position: "relative",
                            minHeight: { xs: 250, md: 300 },
                            // Ensure the parent container has an explicit height or overflow hidden for html2canvas
                            overflow: 'hidden',
                        }}
                    >
                        {/* Background Image - Changed from absolute inset to standard sizing */}
                        <Box
                            component="img"
                            src="/flag.jpg"
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                zIndex: 1,
                            }}
                        />

                        {/* Curve Overlay - Replaced flaky clipPath with a pseudo-element border/gradient approach */}
                        <Box
                            sx={{
                                position: "absolute",
                                left: -1, // Tiny overlap to prevent fine pixel lines
                                top: 0,
                                bottom: 0,
                                width: 80,
                                bgcolor: "#ffffff",
                                borderTopRightRadius: '100% 50%',
                                borderBottomRightRadius: '100% 50%',
                                display: { xs: "none", md: "block" },
                                zIndex: 2,
                            }}
                        />

                        {/* Floating card */}
                        <Paper
                            sx={{
                                position: "absolute",
                                bottom: 20,
                                right: 20,
                                py: 0.5,
                                px: 2,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                borderRadius: 2,
                                maxWidth: 200,
                                borderWidth: 1,
                                borderColor: "#d8d8d8",
                                zIndex: 3, // Explicitly declare high z-index over the image
                            }}
                        >
                            <SchoolIcon sx={{ color: PRIMARY_DARK }} />
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>
                                    Shape Tomorrow
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: 10, color: SECONDARY_BLUE }}>
                                    Start Today
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* 2. CORE METRICS STRIP */}
                <Box sx={{ bgcolor: PRIMARY_DARK, color: '#fff', px: 4, py: 0.5, pb: 5 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        {/* Level */}
                        <Box sx={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '50%', display: 'flex' }}>
                                    <SchoolIcon sx={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.level || "Level 9"}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)", mx: 2, my: 1, display: { xs: "none", sm: "block" } }} />

                        {/* Credits */}
                        <Box sx={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '50%', display: 'flex' }}>
                                    <MenuBookIcon sx={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', fontSize: '11px' }}>Credits</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.credits || 180}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)", mx: 2, my: 1, display: { xs: "none", sm: "block" } }} />

                        {/* Duration */}
                        <Box sx={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '50%', display: 'flex' }}>
                                    <AccessTimeIcon sx={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', fontSize: '11px' }}>Duration</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{course.duration || "18 Months"}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                        <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.2)", mx: 2, my: 1, display: { xs: "none", sm: "block" } }} />

                        {/* Intakes */}
                        <Box sx={{ width: "25%", alignItems: "center", justifyContent: "center" }}>
                            <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="center">
                                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: '50%', display: 'flex' }}>
                                    <CalendarMonthIcon sx={{ color: '#fff' }} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', fontSize: '11px' }}>Intakes</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {course.intakes?.join(' | ') || "Feb | Jul | Nov"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>

                {/* 3. INFORMATION SPLIT-GRID CONTENT */}
                <Grid container spacing={4} sx={{ px: 4, bgcolor: '#ffffff' }}>

                    {/* LEFT ROW FIELDS */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            {/* About Program */}
                            {course.structure && <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <InfoIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>ABOUT THE PROGRAM</Typography>
                                </Stack>
                                <Typography variant="body2" sx={{}}>
                                    {course.structure || ""}
                                </Typography>
                            </Box>}

                            {/* Specializations */}
                            {course.specializations?.length > 0 && <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <PersonIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>SPECIALIZATIONS</Typography>
                                </Stack>
                                <Grid container spacing={0.5}>
                                    {course.specializations?.length > 6 ? ((course.specializations?.length ? course.specializations : []).map((spec, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                • {spec}
                                            </Typography>
                                        </Grid>
                                    ))) :
                                        ((course.specializations?.length ? course.specializations : []).map((spec, index) => (
                                            <Grid item xs={12} key={index}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    • {spec}
                                                </Typography>
                                            </Grid>
                                        )))
                                    }
                                </Grid>
                            </Box>}

                            {/* Career Opportunities */}
                            {course.careerOpportunities?.length > 0 && <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <WorkIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>CAREER OPPORTUNITIES</Typography>
                                </Stack>
                                <Grid container spacing={0.5}>
                                    {course.careerOpportunities?.length > 6 ? ((course.careerOpportunities?.length ? course.careerOpportunities : []).map((career, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                • {career}
                                            </Typography>
                                        </Grid>
                                    ))) :
                                        ((course.careerOpportunities?.length ? course.careerOpportunities : []).map((career, index) => (
                                            <Grid item xs={12} key={index}>
                                                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    • {career}
                                                </Typography>
                                            </Grid>
                                        )))
                                    }
                                </Grid>
                            </Box>}
                        </Stack>
                    </Grid>

                    {/* RIGHT ROW FIELDS */}
                    <Grid item xs={12} md={6}>
                        <Stack spacing={3}>
                            {/* Entry Requirements */}
                            {course.entryRequirements?.length > 0 && <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <AssignmentIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>ENTRY REQUIREMENTS</Typography>
                                </Stack>
                                <Stack spacing={0.5}>
                                    {(course.entryRequirements?.length ? course.entryRequirements : []).map((req, index) => (
                                        <Typography key={index} variant="body2" sx={{}}>
                                            • {req}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Box>}

                            {/* English Requirements */}
                            <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <LanguageIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>ENGLISH REQUIREMENT</Typography>
                                </Stack>
                                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                    <Table size="small">
                                        <TableHead sx={{ bgcolor: '#f0f7ff' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600, color: PRIMARY_DARK, py: 0.5 }}>Test</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600, color: PRIMARY_DARK, py: 0.5 }}>Overall Score</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 600, color: PRIMARY_DARK, py: 0.5 }}>Minimum Band</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {course.englishRequirement?.length ? (
                                                course.englishRequirement.map((eng, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell sx={{ py: 0.5 }}>{eng.test}</TableCell>
                                                        <TableCell align="center" sx={{ py: 0.5 }}>{eng.overallScore}</TableCell>
                                                        <TableCell align="center" sx={{ py: 0.5 }}>{eng.minimumBand}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell sx={{ py: 0.5 }}>IELTS Academic</TableCell>
                                                    <TableCell align="center" sx={{ py: 0.5 }}>6.5</TableCell>
                                                    <TableCell align="center" sx={{ py: 0.5 }}>6.0</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>

                            {/* Program Features */}
                            {course.features?.length > 0 && <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                    <CheckCircleIcon sx={{ color: SECONDARY_BLUE }} />
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: PRIMARY_DARK }}>PROGRAM FEATURES</Typography>
                                </Stack>
                                <Stack spacing={0.5}>
                                    {(course.features?.slice(0, 5) || []).map((feat, index) => (
                                        <Typography key={index} variant="body2" sx={{}}>
                                            • {feat}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Box>}
                        </Stack>
                    </Grid>
                </Grid>

                {/* 5. FOOTER CONTAINER CONTACT INFO */}
                <Box sx={{ bgcolor: PRIMARY_DARK, color: '#ffffff', py: 2, px: 4, mt: 2 }}>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid item xs={12} sm={4} textAlign={{ xs: 'center', sm: 'left' }}>
                            <Typography variant="body2">
                                🌐 {course.universityInfo?.website}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} textAlign="center">
                            <Typography variant="body2">
                                ✉️ {course.universityInfo.email}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} textAlign={{ xs: 'center', sm: 'right' }}>
                            <Typography variant="body2">
                                📞 {course.universityInfo.phoneNumber}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

            </Box>
        </Box>
    );
};

export default CoursePost;