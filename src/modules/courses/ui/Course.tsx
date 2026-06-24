"use client";

import React, { useRef } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Grid,
    Card,
    CardContent,
    Divider,
    Chip,
    Stack,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import LanguageIcon from '@mui/icons-material/Language';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import DescriptionIcon from '@mui/icons-material/Description';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import StarIcon from '@mui/icons-material/Star';
import ViewListIcon from '@mui/icons-material/ViewList';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { CourseProp } from '../courses.types';

import { getCookieUser } from '@/utils/cookie.util';
import { logActivity } from '@/utils/logActivity';


const Course: React.FC<CourseProp> = ({ course, setIsModalOpen }) => {
    const courseRef = useRef<HTMLDivElement>(null);
    const user = getCookieUser();

    const handleDownloadPDF = async () => {
        const html2pdf = (await import("html2pdf.js")).default;
        const element = courseRef.current;
        if (!element) return;

        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSE_PDF_DOWNLOAD",
                path: "/modules/courses/ui/Course",
                method: "CLIENT",
                meta: {
                    courseId: course.id,
                    courseTitle: course.title,
                },
            });
        }

        const options = {
            margin: 0.4,
            filename: `${course.title.toLowerCase().replace(/\s+/g, '-')}-brochure.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        };

        html2pdf().set(options).from(element).save();
    };

    const handleClose = () => {
        setIsModalOpen(false);

        // ✅ LOG CLOSE
        if (user) {
            logActivity({
                userId: user.id,
                action: "COURSE_MODAL_CLOSE",
                path: "/modules/courses/ui/Course",
                method: "CLIENT",
                meta: {
                    courseId: course.id,
                },
            });
        }
    };

    return (
        <Box sx={{
            maxWidth: 950,
            margin: 'auto',
            bgcolor: '#ffffff',
            borderRadius: 4,
            overflow: 'hidden',
        }}>

            {/* Top Header Action Bar (Excluded from PDF) */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: '14px 0px',
            }}>
                <Typography variant="subtitle2" sx={{ color: '#000', fontWeight: 600, letterSpacing: '0.5px' }}>
                </Typography>
                <Stack direction="row" spacing={1.5}>
                    <IconButton
                        onClick={handleDownloadPDF}
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
            <Box ref={courseRef} sx={{ bgcolor: '#ffffff' }}>

                {/* 1. Header Hero Panel */}
                <Box sx={{ mb: 2.5 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <Chip
                            label={course.level || ""}
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: '6px', bgcolor: '#e0e7ff', color: '#4338ca', fontSize: '0.75rem' }}
                        />
                        <Chip
                            label={`${course.credits || 180} Credits`}
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 600, borderRadius: '6px', borderColor: '#e2e8f0', color: '#000', fontSize: '0.75rem' }}
                        />
                    </Stack>

                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#0f172a', mb: 1, letterSpacing: '-0.5px', lineHeight: 1.25 }}>
                        {course.title || ""}
                    </Typography>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, rowGap: 1 }}>
                        <Typography variant="body1" sx={{ color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <SchoolIcon sx={{ fontSize: 20, color: '#6366f1' }} /> {course.universityInfo?.name || "academyEX"}
                        </Typography>
                        <Box sx={{ width: 4, height: 4, bgcolor: '#cbd5e1', borderRadius: '50%', display: { xs: 'none', sm: 'block' } }} />
                        <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                            {course.universityInfo?.address || ""}, {course.universityInfo?.countryInfo?.title?.EN || ""}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ mb: 2.5, borderColor: '#e2e8f0' }} />

                {/* 2. Main Content Split */}
                <Grid container spacing={3}>

                    {/* Left Panel: Detailed Info */}
                    <Grid item xs={12} md={7}>
                        <Stack spacing={2.5}>
                            {/* Description / Overview */}
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <DescriptionIcon sx={{ color: '#000', fontSize: 20 }} /> Course Overview
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#000', lineHeight: 1.3 }}>
                                    {course.description || ""}
                                </Typography>
                            </Box>

                            {/* Key Study Areas / Specializations */}
                            {course.specializations?.length > 0 && (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <StarIcon sx={{ color: '#eab308', fontSize: 20 }} /> Key Study Areas
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {course.specializations.map((spec, index) => (
                                            <Chip
                                                key={index}
                                                label={spec}
                                                variant="outlined"
                                                size='small'
                                                sx={{ bgcolor: '#f8fafc', borderColor: '#e2e8f0', color: '#000', borderRadius: '5px', fontWeight: 500, fontSize: '12px' }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Programme Structure */}
                            {course.structure && (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <ViewListIcon sx={{ color: '#6366f1', fontSize: 20 }} />
                                        Programme Structure
                                    </Typography>

                                    {course.structure.split(',').map((item, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                mb: 0.5,
                                                p: 0.5,
                                                borderRadius: 1,
                                                backgroundColor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                gap: 1,
                                                height: "100%"
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    minWidth: 20,
                                                    height: 20,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#6366f1',
                                                    color: 'white',
                                                    fontSize: 10,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mt: 0.2,
                                                    pb: 0.5,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {index + 1}
                                            </Box>

                                            <Typography variant="body2" sx={{ color: '#000' }}>
                                                {item.trim()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Academic Entry Requirements */}
                            {course.entryRequirements?.length > 0 && (
                                <Box
                                    sx={{
                                        p: 1.5,
                                        bgcolor: '#f8fafc',
                                        borderRadius: 3,
                                        border: '1px solid #e2e8f0'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AssignmentTurnedInIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />
                                        Entry & Registration Requirements
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                        {course.entryRequirements.map((item: string, index: number) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: 1.5,
                                                }}
                                            >
                                                {/* bullet icon */}
                                                <Box
                                                    sx={{
                                                        minWidth: 15,
                                                        height: 15,
                                                        borderRadius: '50%',
                                                        bgcolor: '#bbb',
                                                        color: '#fff',
                                                        fontSize: 10,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        mt: 0.2,
                                                        ml: 2,
                                                        pb: 0.5,
                                                    }}
                                                >
                                                    ✓
                                                </Box>

                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: '#000',
                                                        lineHeight: 1.3
                                                    }}
                                                >
                                                    {item}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            )}

                            {/* Career Opportunities */}
                            {course.careerOpportunities?.length > 0 && (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <WorkspacePremiumIcon sx={{ color: '#10b981', fontSize: 20 }} />
                                        Career Opportunities
                                    </Typography>

                                    <Grid container spacing={0.5}>
                                        {course.careerOpportunities.map((career: string, index: number) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Box
                                                    sx={{
                                                        p: 0.5,
                                                        borderRadius: 2,
                                                        bgcolor: '#ecfdf5',
                                                        border: '1px solid #a7f3d0',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        height: "100%"
                                                    }}
                                                >
                                                    {/* Icon bullet */}
                                                    <Box
                                                        sx={{
                                                            width: 20,
                                                            height: 20,
                                                            borderRadius: '50%',
                                                            bgcolor: '#10b981',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fff',
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                            pb: 0.5,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>

                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: '#000',
                                                            fontWeight: 500
                                                        }}
                                                    >
                                                        {career}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Stack>
                    </Grid>

                    {/* Right Panel: Sidebar Information Cards */}
                    <Grid item xs={12} md={5}>
                        <Stack spacing={2}>
                            {/* Quick Facts Sidebar Card */}
                            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0', overflow: 'hidden' }}>
                                <Box sx={{ px: 1.5, py: 1, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#000', letterSpacing: '1px' }}>
                                        Program Summary
                                    </Typography>
                                </Box>
                                <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ p: 0.8, bgcolor: '#f0fdf4', borderRadius: '8px', color: '#16a34a' }}>
                                                <CalendarMonthIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" display="block" sx={{ color: '#94a3b8', fontWeight: 600 }}>DURATION</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>{course.duration || ""}</Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ p: 0.8, bgcolor: '#eff6ff', borderRadius: '8px', color: '#2563eb' }}>
                                                <PaidIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" display="block" sx={{ color: '#94a3b8', fontWeight: 600 }}>ESTIMATED TUITION</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#059669' }}>
                                                    {course.tuitionFee ? `$${course.tuitionFee.toLocaleString()}` : 'Contact for Fees'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                            <Box sx={{ p: 0.8, bgcolor: '#fdf2f8', borderRadius: '8px', color: '#db2777' }}>
                                                <CalendarMonthIcon fontSize="small" />
                                            </Box>
                                            <Box>
                                                <Typography variant="body2" display="block" sx={{ color: '#94a3b8', fontWeight: 600 }}>AVAILABLE INTAKES</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                                                    {course.intakes?.length > 0 ? course.intakes.join(', ') : '_'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Key Benefits Card */}
                            {course.features?.length > 0 && (
                                <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0', bgcolor: '#fdfdfd' }}>
                                    <Box sx={{ px: 1.5, py: 1, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: '#4f46e5', letterSpacing: '1px' }}>
                                            Key Benefits & Work Rights
                                        </Typography>
                                    </Box>
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                        <Stack spacing={1}>
                                            {course.features.map((feat, index) => (
                                                <Box key={index} sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
                                                    <VerifiedUserIcon sx={{ color: '#4f46e5', fontSize: 16, }} />
                                                    <Typography variant="body2" sx={{ color: '#000', fontSize: '12px', lineHeight: 1.2 }}>
                                                        {feat}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            )}

                            {/* English Language Requirements */}
                            {course.englishRequirement?.length > 0 && (
                                <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e2e8f0', borderLeft: '4px solid #4f46e5', bgcolor: '#f8fafc' }}>
                                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#000', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LanguageIcon sx={{ color: '#4f46e5', fontSize: 20 }} /> Language Competency
                                        </Typography>

                                        {course.englishRequirement.map((eng, index) => (
                                            <Box key={index} sx={{ mb: index !== course.englishRequirement.length - 1 ? 0.5 : 0, p: 1, bgcolor: '#ffffff', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{eng.test}</Typography>
                                                <Grid container sx={{ mt: 0.5 }}>
                                                    <Box sx={{ display: "flex", gap: 1 }}>
                                                        <Typography variant="body2" sx={{ color: '#a1a1a1', fontWeight: 500 }}>Overall Score</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#4f46e5' }}>{eng.overallScore}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: 1, marginLeft: 2 }}>
                                                        <Typography variant="body2" sx={{ color: '#a1a1a1', fontWeight: 500 }}>Min. Band</Typography>
                                                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#000' }}>{eng.minimumBand}</Typography>
                                                    </Box>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </CardContent>
                                </Card>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Course;